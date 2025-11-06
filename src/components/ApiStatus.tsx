import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Loader2, RefreshCw } from "lucide-react";

const ApiStatus = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [apiUrl, setApiUrl] = useState<string>('');

  const checkApiConnection = async () => {
    setStatus('checking');
    const baseUrl = import.meta.env.VITE_API_URL || 'https://web-production-af44.up.railway.app';
    setApiUrl(baseUrl);

    try {
      console.log('🔍 Testing API connection to:', baseUrl);
      const response = await fetch(baseUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ API Connected:', data);
        setStatus('connected');
      } else {
        setStatus('error');
        setErrorDetails(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error('❌ API Connection Failed:', error);
      setStatus('error');
      
      if (error.message.includes('CORS')) {
        setErrorDetails('CORS Error: Backend needs to allow requests from this domain');
      } else if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
        setErrorDetails('Network Error: Cannot reach backend. Check if backend is running and URL is correct.');
      } else {
        setErrorDetails(error.message);
      }
    }
  };

  useEffect(() => {
    checkApiConnection();
  }, []);

  return (
    <Card className="mb-6 border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          API Connection Status
          {status === 'checking' && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
          {status === 'connected' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
          {status === 'error' && <AlertCircle className="h-5 w-5 text-destructive" />}
        </CardTitle>
        <CardDescription>
          Backend: <code className="text-xs bg-muted px-2 py-1 rounded">{apiUrl}</code>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">Status:</span>
          {status === 'checking' && (
            <Badge variant="outline" className="gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Checking...
            </Badge>
          )}
          {status === 'connected' && (
            <Badge className="gap-1 bg-green-500">
              <CheckCircle2 className="h-3 w-3" />
              Connected
            </Badge>
          )}
          {status === 'error' && (
            <Badge variant="destructive" className="gap-1">
              <AlertCircle className="h-3 w-3" />
              Connection Failed
            </Badge>
          )}
        </div>

        {status === 'error' && (
          <div className="space-y-3">
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-sm">
              <p className="font-semibold text-destructive mb-1">Error Details:</p>
              <p className="text-destructive/80">{errorDetails}</p>
            </div>

            <div className="p-4 bg-muted rounded text-sm space-y-2">
              <p className="font-semibold">💡 How to Fix:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Check that your backend is running at: <code className="bg-background px-1 py-0.5 rounded text-xs">{apiUrl}</code></li>
                <li>Add CORS headers to your backend to allow requests from this domain</li>
                <li>For Express.js, add:
                  <pre className="mt-2 p-2 bg-background rounded text-xs overflow-x-auto">
{`const cors = require('cors');
app.use(cors({
  origin: ['${window.location.origin}'],
  credentials: true
}));`}
                  </pre>
                </li>
              </ol>
            </div>
          </div>
        )}

        {status === 'connected' && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded text-sm">
            <p className="text-green-700 dark:text-green-400">
              ✓ Backend API is reachable and responding correctly
            </p>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={checkApiConnection}
          className="gap-2"
          disabled={status === 'checking'}
        >
          <RefreshCw className={`h-4 w-4 ${status === 'checking' ? 'animate-spin' : ''}`} />
          Test Connection
        </Button>
      </CardContent>
    </Card>
  );
};

export default ApiStatus;
