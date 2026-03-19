import React, { useState } from "react";
import { AlertTriangle, Key, RefreshCw, CheckCircle2, XCircle, Loader2, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";

const SERVER = `https://${projectId}.supabase.co/functions/v1/make-server-cc38a303`;

interface KeyTestResult {
  envKeyPresent: boolean;
  envKeyInfo: {
    rawLength: number;
    firstCharCodes: number[];
    lastCharCodes: number[];
    hasQuotes: boolean;
    hasWhitespace: boolean;
    hasNonAscii: boolean;
  } | null;
  sanitizedKey: {
    length: number;
    preview: string;
    allAlphanumeric: boolean;
  } | null;
  rpcTest: {
    httpStatus: number;
    ok: boolean;
    bodyPreview: string;
    blockNumber?: number;
    success?: boolean;
    rpcError?: string;
    error?: string;
  } | null;
}

export default function AlchemyKeyDiagnostic() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<KeyTestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runTest = async () => {
    setTesting(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${SERVER}/alchemy/test-key`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      }

      const data = await res.json();
      setResult(data);

      if (data.rpcTest?.success) {
        toast.success("Alchemy Key Valid!", {
          style: { background: "#020202", border: "1px solid #4ade80", color: "#4ade80" },
        });
      } else {
        toast.error("Alchemy Key Invalid", {
          style: { background: "#020202", border: "1px solid #ef4444", color: "#ef4444" },
        });
      }
    } catch (e: any) {
      setError(e.message);
      toast.error("Test Failed", {
        style: { background: "#020202", border: "1px solid #ef4444", color: "#ef4444" },
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-sm bg-[#d4af37]/10 border border-[#d4af37]/20">
            <Key size={16} className="text-[#d4af37]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Alchemy API Key Diagnostic</h3>
            <p className="text-xs text-gray-500">Test and validate your ALCHEMY_API_KEY configuration</p>
          </div>
        </div>
        <button
          onClick={runTest}
          disabled={testing}
          className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-bold tracking-wider uppercase border transition-all ${
            testing
              ? "border-blue-500/40 text-blue-400 bg-blue-500/10 cursor-wait"
              : "border-[#d4af37]/50 text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37]/20"
          }`}
        >
          {testing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          {testing ? "Testing..." : "Run Test"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-sm bg-red-500/10 border border-red-500/20">
          <div className="flex items-start gap-3">
            <XCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-red-400">Test Failed</p>
              <p className="text-xs text-gray-400 mt-1 font-mono">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-3">
          {/* ENV Key Presence */}
          <div className={`p-4 rounded-sm border ${result.envKeyPresent ? "bg-green-500/5 border-green-500/20" : "bg-red-500/10 border-red-500/20"}`}>
            <div className="flex items-center gap-2 mb-2">
              {result.envKeyPresent ? (
                <CheckCircle2 size={14} className="text-green-400" />
              ) : (
                <XCircle size={14} className="text-red-400" />
              )}
              <span className="text-xs font-bold text-white">Environment Variable</span>
            </div>
            {result.envKeyPresent ? (
              <div className="space-y-1 text-xs text-gray-400 font-mono">
                <p>✓ ALCHEMY_API_KEY found in environment</p>
                {result.envKeyInfo && (
                  <>
                    <p>• Raw length: {result.envKeyInfo.rawLength} chars</p>
                    <p>• Has quotes: {result.envKeyInfo.hasQuotes ? "Yes ⚠️" : "No ✓"}</p>
                    <p>• Has whitespace: {result.envKeyInfo.hasWhitespace ? "Yes ⚠️" : "No ✓"}</p>
                    <p>• Has non-ASCII: {result.envKeyInfo.hasNonAscii ? "Yes ⚠️" : "No ✓"}</p>
                  </>
                )}
              </div>
            ) : (
              <p className="text-xs text-red-400 font-mono">✗ ALCHEMY_API_KEY not found in Supabase secrets</p>
            )}
          </div>

          {/* Sanitized Key */}
          {result.sanitizedKey && (
            <div className={`p-4 rounded-sm border ${result.sanitizedKey.length >= 30 ? "bg-green-500/5 border-green-500/20" : "bg-yellow-500/10 border-yellow-500/20"}`}>
              <div className="flex items-center gap-2 mb-2">
                {result.sanitizedKey.length >= 30 ? (
                  <CheckCircle2 size={14} className="text-green-400" />
                ) : (
                  <AlertTriangle size={14} className="text-yellow-400" />
                )}
                <span className="text-xs font-bold text-white">Sanitized Key</span>
              </div>
              <div className="space-y-1 text-xs text-gray-400 font-mono">
                <p>• Length: {result.sanitizedKey.length} chars {result.sanitizedKey.length === 32 ? "✓" : result.sanitizedKey.length < 30 ? "⚠️ Too short" : ""}</p>
                <p>• Preview: {result.sanitizedKey.preview}</p>
                <p>• Format: {result.sanitizedKey.allAlphanumeric ? "Valid ✓" : "Contains invalid chars ⚠️"}</p>
              </div>
            </div>
          )}

          {/* RPC Test */}
          {result.rpcTest && (
            <div className={`p-4 rounded-sm border ${result.rpcTest.success ? "bg-green-500/5 border-green-500/20" : "bg-red-500/10 border-red-500/20"}`}>
              <div className="flex items-center gap-2 mb-2">
                {result.rpcTest.success ? (
                  <CheckCircle2 size={14} className="text-green-400" />
                ) : (
                  <XCircle size={14} className="text-red-400" />
                )}
                <span className="text-xs font-bold text-white">Live RPC Test (eth-mainnet)</span>
              </div>
              <div className="space-y-1 text-xs text-gray-400 font-mono">
                <p>• HTTP Status: {result.rpcTest.httpStatus} {result.rpcTest.ok ? "✓" : "✗"}</p>
                {result.rpcTest.blockNumber && <p>• Block Number: #{result.rpcTest.blockNumber.toLocaleString()} ✓</p>}
                {result.rpcTest.rpcError && <p className="text-red-400">• RPC Error: {result.rpcTest.rpcError}</p>}
                {result.rpcTest.error && <p className="text-red-400">• Network Error: {result.rpcTest.error}</p>}
                {!result.rpcTest.ok && <p className="text-xs text-gray-500 mt-2">Response: {result.rpcTest.bodyPreview}</p>}
              </div>
            </div>
          )}

          {/* Diagnosis & Actions */}
          <div className="p-4 rounded-sm bg-white/[0.02] border border-white/5">
            <h4 className="text-xs font-bold text-[#d4af37] mb-3">Diagnosis & Recommended Actions</h4>
            
            {!result.envKeyPresent && (
              <div className="space-y-2 text-xs text-gray-400">
                <p className="text-red-400 font-semibold">✗ No API key found</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Go to your Supabase project dashboard</li>
                  <li>Navigate to: Settings → Edge Functions → Secrets</li>
                  <li>Add secret: <code className="px-1 py-0.5 bg-black/30 rounded text-[#d4af37]">ALCHEMY_API_KEY</code></li>
                  <li>Get your key from <a href="https://dashboard.alchemy.com" target="_blank" rel="noopener" className="text-[#d4af37] hover:underline inline-flex items-center gap-1">Alchemy Dashboard <ExternalLink size={10} /></a></li>
                  <li>Redeploy your Edge Function</li>
                </ol>
              </div>
            )}

            {result.envKeyPresent && result.sanitizedKey && result.sanitizedKey.length < 30 && (
              <div className="space-y-2 text-xs text-gray-400">
                <p className="text-yellow-400 font-semibold">⚠️ Key too short</p>
                <p>Alchemy API keys are typically 32 characters. Your sanitized key is only {result.sanitizedKey.length} chars.</p>
                <p className="text-gray-500">Check for extra quotes, whitespace, or truncation in your Supabase secret.</p>
              </div>
            )}

            {result.rpcTest && result.rpcTest.httpStatus === 401 && (
              <div className="space-y-2 text-xs text-gray-400">
                <p className="text-red-400 font-semibold">✗ Authentication Failed (HTTP 401)</p>
                <p><strong>Your API key is invalid, expired, or malformed.</strong></p>
                <ol className="list-decimal list-inside space-y-1 ml-2 mt-2">
                  <li>Verify your key at <a href="https://dashboard.alchemy.com" target="_blank" rel="noopener" className="text-[#d4af37] hover:underline inline-flex items-center gap-1">Alchemy Dashboard <ExternalLink size={10} /></a></li>
                  <li>Create a new API key if needed (Apps → Create New App → View Key)</li>
                  <li>Copy the <strong>entire key</strong> (usually 32 chars, format: <code className="px-1 py-0.5 bg-black/30 rounded">AbC123dEf456...</code>)</li>
                  <li>Update Supabase secret: <code className="px-1 py-0.5 bg-black/30 rounded text-[#d4af37]">ALCHEMY_API_KEY</code> = <code className="px-1 py-0.5 bg-black/30 rounded">your_new_key_here</code></li>
                  <li>Redeploy Edge Function and re-run this test</li>
                </ol>
              </div>
            )}

            {result.rpcTest && result.rpcTest.httpStatus === 404 && (
              <div className="space-y-2 text-xs text-gray-400">
                <p className="text-yellow-400 font-semibold">⚠️ Network Not Enabled (HTTP 404)</p>
                <p>Your Alchemy key is valid but eth-mainnet network is not enabled.</p>
                <p>Check your plan limits at <a href="https://dashboard.alchemy.com" target="_blank" rel="noopener" className="text-[#d4af37] hover:underline inline-flex items-center gap-1">Alchemy Dashboard <ExternalLink size={10} /></a></p>
              </div>
            )}

            {result.rpcTest?.success && (
              <div className="space-y-2 text-xs text-gray-400">
                <p className="text-green-400 font-semibold">✓ All Systems Operational</p>
                <p>Your Alchemy API key is valid and working correctly.</p>
                <p className="text-gray-500">Current block: #{result.rpcTest.blockNumber?.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions (if no test run yet) */}
      {!result && !error && !testing && (
        <div className="p-4 rounded-sm bg-white/[0.02] border border-white/5">
          <h4 className="text-xs font-bold text-[#d4af37] mb-2">About This Test</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            This diagnostic will check your <code className="px-1 py-0.5 bg-black/30 rounded text-[#d4af37]">ALCHEMY_API_KEY</code> environment variable,
            verify the sanitization process, and perform a live RPC call to eth-mainnet to confirm authentication.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            If you're seeing 401 errors in your diagnostics, this tool will help identify whether the issue is with the key itself or the configuration.
          </p>
        </div>
      )}
    </div>
  );
}
