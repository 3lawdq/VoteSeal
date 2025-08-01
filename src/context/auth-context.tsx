'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { Web3Auth } from '@web3auth/modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import {
  CHAIN_NAMESPACES,
  type SafeEventEmitterProvider,
  type UserInfo,
} from '@web3auth/base';
import Web3 from 'web3';

import { syncOfflineVotes } from '@/services/sync-manager'; // ✅ Sync trigger

interface AuthUser {
  address: string;
  email?: string;
  name?: string;
  profileImage?: string;
}

interface AuthContextType {
  web3auth: Web3Auth | null;
  provider: SafeEventEmitterProvider | null;
  user: AuthUser | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getBalance: () => Promise<string | undefined>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const clientId = 'BAv6OgP4iSlXiNqjJu_crDH2Noxb7fd47iFGgIKl2pJipb7PcpEXjK7EaAB-kgUAUOoYdrR_4c5DCl8BQrDab-4';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: '0x7a69',
          rpcTarget: 'https://vehicle-edinburgh-psi-honest.trycloudflare.com',
        };

        const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

        const web3authInstance = new Web3Auth({
          clientId,
          web3AuthNetwork: 'sapphire_devnet',
          privateKeyProvider,
        });

        const adapter = new OpenloginAdapter();
        web3authInstance.configureAdapter(adapter);

        await web3authInstance.initModal();
        setWeb3auth(web3authInstance);

        if (web3authInstance.provider) {
          const web3 = new Web3(web3authInstance.provider);
          const accounts = await web3.eth.getAccounts();
          const userInfo: UserInfo = await web3authInstance.getUserInfo();

          setProvider(web3authInstance.provider);
          setUser({
            address: accounts[0],
            email: userInfo.email,
            name: userInfo.name,
            profileImage: userInfo.profileImage,
          });

          // 🧠 Automatically sync votes when reconnected
          syncOfflineVotes(web3authInstance.provider);
        }
      } catch (err) {
        console.error('❌ Web3Auth init failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) return;
    try {
      const web3authProvider = await web3auth.connect();
      if (!web3authProvider) throw new Error('Provider is null');

      const web3 = new Web3(web3authProvider);
      const accounts = await web3.eth.getAccounts();
      const userInfo: UserInfo = await web3auth.getUserInfo();

      setProvider(web3authProvider);
      setUser({
        address: accounts[0],
        email: userInfo.email,
        name: userInfo.name,
        profileImage: userInfo.profileImage,
      });

      // 🧠 Automatically sync votes after login
      syncOfflineVotes(web3authProvider);
    } catch (err) {
      console.error('❌ Login error:', err);
    }
  };

  const logout = async () => {
    if (!web3auth) return;
    try {
      await web3auth.logout();
      setUser(null);
      setProvider(null);
    } catch (err) {
      console.error('❌ Logout error:', err);
    }
  };

  const getBalance = useCallback(async (): Promise<string | undefined> => {
    const currentAddress = user?.address;
    if (!provider || !currentAddress) return;

    try {
      const web3 = new Web3(provider);
      const balanceWei = await web3.eth.getBalance(currentAddress);
      return web3.utils.fromWei(balanceWei, 'ether');
    } catch (err) {
      console.error('❌ Error fetching balance:', err);
      return undefined;
    }
  }, [provider, user?.address]);

  const contextValue = useMemo(() => ({
    web3auth,
    provider,
    user,
    isLoading,
    login,
    logout,
    getBalance,
  }), [web3auth, provider, user, isLoading, login, logout, getBalance]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
