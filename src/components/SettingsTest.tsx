import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Loader2, Settings } from 'lucide-react';
import { useAllSiteSettings, useUpdateSiteSetting } from '../hooks/useSiteSettings';

export const SettingsTest: React.FC = () => {
  const { data: settingsData, isLoading, error, refetch } = useAllSiteSettings();
  const updateSetting = useUpdateSiteSetting();
  const [testKey, setTestKey] = useState('test_setting');
  const [testValue, setTestValue] = useState('test_value');

  const handleTestUpdate = async () => {
    try {
      await updateSetting.mutateAsync({
        key: testKey,
        value: testValue,
        description: 'Test setting for API verification'
      });
      refetch();
    } catch (error) {
      console.error('Failed to update setting:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Settings API Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>Loading settings...</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load settings: {error.message}
            </AlertDescription>
          </Alert>
        )}

        {settingsData && (
          <Alert>
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription>
              ✅ Settings API connected! Found {settingsData.data?.settings?.length || 0} settings
            </AlertDescription>
          </Alert>
        )}

        {settingsData?.data?.settings && (
          <div className="space-y-2">
            <h4 className="font-semibold">Current Settings:</h4>
            <div className="max-h-40 overflow-y-auto space-y-1 text-sm">
              {settingsData.data.settings.slice(0, 5).map((setting) => (
                <div key={setting._id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="font-mono text-xs">{setting.key}:</span>
                  <span className="truncate">{setting.value}</span>
                </div>
              ))}
              {settingsData.data.settings.length > 5 && (
                <p className="text-xs text-muted-foreground">
                  ... and {settingsData.data.settings.length - 5} more
                </p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4 border-t pt-4">
          <h4 className="font-semibold">Test Setting Update:</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="testKey">Key</Label>
              <Input
                id="testKey"
                value={testKey}
                onChange={(e) => setTestKey(e.target.value)}
                placeholder="setting_key"
              />
            </div>
            <div>
              <Label htmlFor="testValue">Value</Label>
              <Input
                id="testValue"
                value={testValue}
                onChange={(e) => setTestValue(e.target.value)}
                placeholder="setting_value"
              />
            </div>
          </div>
          <Button 
            onClick={handleTestUpdate} 
            disabled={updateSetting.isPending || !testKey || !testValue}
            className="w-full"
          >
            {updateSetting.isPending ? 'Updating...' : 'Test Update Setting'}
          </Button>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => refetch()} variant="outline">
            Refresh Settings
          </Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Settings Endpoint:</strong> /settings</p>
          <p><strong>Update Endpoint:</strong> PUT /settings</p>
        </div>
      </CardContent>
    </Card>
  );
};