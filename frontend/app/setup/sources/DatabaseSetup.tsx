"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Adjust this import path based on your file structure
import PageHeader from "@/components/PageHeader";

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

  return (
    <div className="space-y-4">
      <div>
        <Label>Display Name</Label>
        <Input
          value={data.displayName}
          onChange={(e) => setData({ ...data, displayName: e.target.value })}
          onBlur={handleBlur}
        />
      </div>
      <div>
        <Label>Database Type</Label>
        <Select value={data.type} onValueChange={(value) => {
          setData({ ...data, type: value });
          handleBlur();
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="postgres">PostgreSQL</SelectItem>
            <SelectItem value="mysql">MySQL</SelectItem>
            <SelectItem value="mssql">SQL Server</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Username</Label>
          <Input
            value={data.username}
            onChange={(e) => setData({ ...data, username: e.target.value })}
            onBlur={handleBlur}
          />
        </div>
        <div>
          <Label>Password</Label>
          <Input
            type="password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            onBlur={handleBlur}
          />
        </div>
      </div>
      <div>
        <Label>Hostname</Label>
        <Input
          value={data.hostname}
          onChange={(e) => setData({ ...data, hostname: e.target.value })}
          onBlur={handleBlur}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Port</Label>
          <Input
            value={data.port}
            onChange={(e) => setData({ ...data, port: e.target.value })}
            onBlur={handleBlur}
          />
        </div>
        <div>
          <Label>Database Name</Label>
          <Input
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            onBlur={handleBlur}
          />
        </div>
      </div>
    </div>
  );
}

export default function DatabaseSetupBox() {
  // Database form states
  const [dbDisplayName, setDbDisplayName] = useState("");
  const [dbType, setDbType] = useState("");
  const [dbUsername, setDbUsername] = useState("");
  const [dbPassword, setDbPassword] = useState("");
  const [dbHostname, setDbHostname] = useState("");
  const [dbPort, setDbPort] = useState("");
  const [dbName, setDbName] = useState("");

  const handleTestConnection = () => {
    const dbData = {
      dbDisplayName,
      dbType,
      dbUsername,
      dbPassword,
      dbHostname,
      dbPort,
      dbName,
    };
    console.log("Testing connection with:", dbData);
    alert("Test connection logic goes here!");
  };

  return (
    <div className="bg-white p-4 rounded-lg border bg-card text-card-foreground shadow">
      {/* Use PageHeader for title & subtext */}
      <PageHeader
        heading="Add Database"
        subtext="Upload your database"
      />

      {/* Additional row with Postgres chip + plus button */}
      <div className="flex items-center gap-2 mt-2 mb-6">
        <span className="bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
          Postgres Prod 1
        </span>
        <button
          type="button"
          className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 hover:bg-gray-100"
        >
          <span className="text-gray-700 text-lg">+</span>
        </button>
      </div>

      {/* Form Fields */}
      <div className="grid gap-4">
        <div>
          <Label htmlFor="db-display-name">Database Display Name</Label>
          <Input
            id="db-display-name"
            placeholder="dbdisplayname"
            value={dbDisplayName}
            onChange={(e) => setDbDisplayName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="db-type">Database Type</Label>
          <Select value={dbType} onValueChange={setDbType}>
            <SelectTrigger id="db-type">
              <SelectValue placeholder="Select a database type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="postgres">Postgres</SelectItem>
              <SelectItem value="mysql">MySQL</SelectItem>
              <SelectItem value="sqlite">SQLite</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="username">User Name</Label>
          <Input
            id="username"
            placeholder="dbuser"
            value={dbUsername}
            onChange={(e) => setDbUsername(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="dbpassword"
            value={dbPassword}
            onChange={(e) => setDbPassword(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="hostname">Hostname</Label>
          <Input
            id="hostname"
            placeholder="dbhost"
            value={dbHostname}
            onChange={(e) => setDbHostname(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="port">Port</Label>
            <Input
              id="port"
              placeholder="dbport"
              value={dbPort}
              onChange={(e) => setDbPort(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="dbname">Database Name</Label>
            <Input
              id="dbname"
              placeholder="dbname"
              value={dbName}
              onChange={(e) => setDbName(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Test Connection Button */}
      <Button className="w-full mt-4" onClick={handleTestConnection}>
        Test Connection
      </Button>
    </div>
  );
}
