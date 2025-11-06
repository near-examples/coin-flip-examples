import { useEffect, useState } from "react";
import { JsonRpcProvider } from "@near-js/providers";
import type { NearConnector, NearWalletBase } from "@hot-labs/near-connect";

interface ViewFunctionParams {
  contractId: string;
  method: string;
  args?: Record<string, unknown>;
}

interface FunctionCallParams {
  contractId: string;
  method: string;
  args?: Record<string, unknown>;
  gas?: string;
  deposit?: string;
}

let connector: NearConnector | undefined;
const provider = new JsonRpcProvider({ url: "https://test.rpc.fastnear.com" });

export function useNear() {
  const [wallet, setWallet] = useState<NearWalletBase | undefined>(undefined);
  const [signedAccountId, setSignedAccountId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    async function initializeConnector() {
      if (!connector) {
        const { NearConnector } = await import("@hot-labs/near-connect");
        connector = new NearConnector({ network: "testnet" });
      }

      async function reload() {
        try {
          const { wallet, accounts } = await connector!.getConnectedWallet();
          setWallet(wallet);
          setSignedAccountId(accounts[0].accountId);
        } catch {
          setWallet(undefined);
          setSignedAccountId("");
        } finally {
          setLoading(false);
        }
      }

      async function onSignOut() {
        setWallet(undefined);
        setSignedAccountId("");
      }

      async function onSignIn(payload: { wallet: NearWalletBase }) {
        console.log("Signed in with payload", payload);
        setWallet(payload.wallet);
        const accounts = await payload.wallet.getAccounts();
        setSignedAccountId(accounts[0]?.accountId || "");
      }

      connector.on("wallet:signOut", onSignOut);
      connector.on("wallet:signIn", onSignIn);

      await reload();

      return () => {
        if (!connector) return;
        connector.off("wallet:signOut", onSignOut);
        connector.off("wallet:signIn", onSignIn);
      };
    }

    initializeConnector();
  }, []);

  async function signIn() {
    if (!connector) return;
    const wallet = await connector.connect();
    console.log("Connected wallet", wallet);
  }

  async function signOut() {
    if (!connector || !wallet) return;
    await connector.disconnect(wallet);
    console.log("Disonnected wallet");
  }

  async function viewFunction({ contractId, method, args = {} }: ViewFunctionParams) {
    const response = await provider.query({
      request_type: "call_function",
      account_id: contractId,
      method_name: method,
      args_base64: Buffer.from(JSON.stringify(args)).toString("base64"),
      finality: "final",
    });
    // @ts-ignore - response type from provider
    return JSON.parse(Buffer.from(response.result).toString());
  }

 async function callFunction({ contractId, method, args = {}, gas = "30000000000000", deposit = "0" }: FunctionCallParams) {
    if (!wallet) throw new Error("Wallet not connected");
    
    return wallet.signAndSendTransaction({
      receiverId: contractId,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: method,
            args,
            gas,
            deposit,
          },
        },
      ],
    });
  }

  return {
    signedAccountId,
    wallet,
    signIn,
    signOut,
    loading,
    viewFunction,
    callFunction,
    provider,
  };
}