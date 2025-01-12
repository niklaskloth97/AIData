import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"

export interface DatabaseFormData {
  id: string;
  displayName: string;
  type: string;
  username: string;
  password: string;
  hostname: string;
  port: string;
  name: string;
}

interface DatabaseFormProps {
  initialData: DatabaseFormData;
  onSave: (id: string, data: DatabaseFormData) => void;
}

export function DatabaseForm({ initialData, onSave }: DatabaseFormProps) {
  const [data, setData] = useState(initialData);

  const handleBlur = () => {
    onSave(data.id, data);
  };

  const handleChange = (field: keyof DatabaseFormData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Display Name</Label>
        <Input
          value={data.displayName}
          onChange={(e) => handleChange('displayName', e.target.value)}
          onBlur={handleBlur}
        />
      </div>
      <div>
        <Label>Database Type</Label>
        <Select 
          value={data.type} 
          onValueChange={(value) => {
            handleChange('type', value);
            handleBlur();
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="postgres">PostgreSQL</SelectItem>
            <SelectItem value="sapsql">SAP-SQL-Server</SelectItem>
            <SelectItem value="mssql">Microsoft SQL Server</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Username</Label>
          <Input
            value={data.username}
            onChange={(e) => handleChange('username', e.target.value)}
            onBlur={handleBlur}
          />
        </div>
        <div>
          <Label>Password</Label>
          <Input
            type="password"
            value={data.password}
            onChange={(e) => handleChange('password', e.target.value)}
            onBlur={handleBlur}
          />
        </div>
      </div>
      <div>
        <Label>Hostname</Label>
        <Input
          value={data.hostname}
          onChange={(e) => handleChange('hostname', e.target.value)}
          onBlur={handleBlur}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Port</Label>
          <Input
            value={data.port}
            onChange={(e) => handleChange('port', e.target.value)}
            onBlur={handleBlur}
          />
        </div>
        <div>
          <Label>Database Name</Label>
          <Input
            value={data.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={handleBlur}
          />
        </div>
      </div>
    </div>
  );
}