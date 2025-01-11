import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export function AIModelSelection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Model Selection</CardTitle>
        <CardDescription>Choose the AI model for your queries</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-model">API Model</Label>
          {/* Set defaultValue to "chatgpt-4o" */}
          <Select defaultValue="chatgpt-4o">
            <SelectTrigger>
              <SelectValue placeholder="Select API Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chatgpt">ChatGPT-o1 (Default)</SelectItem>
              <SelectItem value="chatgpt-mini">ChatGPT-o1-mini</SelectItem>
              <SelectItem value="chatgpt-4o">ChatGPT-4o</SelectItem>
              <SelectItem value="claude">Claude 3.5 Sonnet</SelectItem>
              <SelectItem value="llama">Llama 3.3-70B</SelectItem>
              <SelectItem value="mixtral">Mixtral 8x7B</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <Input id="api-key" type="password" placeholder="Enter your API key" />
        </div>
      </CardContent>
    </Card>
  );
}

export function InterfacePreferences() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interface Preferences</CardTitle>
        <CardDescription>Customize your workspace appearance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <Label>Theme Selection</Label>
          <RadioGroup defaultValue="system" className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="disableddark" id="disableddark" />
              <Label htmlFor="disableddark">Dark</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system">System</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Manage your notification preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notif">Email Notifications</Label>
          <Switch id="email-notif" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="usage-alerts">Usage Alerts</Label>
          <Switch id="usage-alerts" />
        </div>
      </CardContent>
    </Card>
  );
}

export function PrivacySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data & Privacy</CardTitle>
        <CardDescription>Control your data usage and privacy settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="data-collection">Data Collection</Label>
          <Switch id="data-collection" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="analytics">Analytics</Label>
          <Switch id="analytics" />
        </div>
      </CardContent>
    </Card>
  );
}
