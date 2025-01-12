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
import { DatabaseTabs } from "./components/DatabaseTabs";

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

// interface DatabaseFormProps {
//   initialData: DatabaseFormData;
//   onSave: (id: string, data: DatabaseFormData) => void;
// }

// export function DatabaseForm({ initialData, onSave }: DatabaseFormProps) {
//   const [data, setData] = useState(initialData);

//   const handleBlur = () => {
//     onSave(data.id, data);
//   };

//   return (
//     <div className="space-y-4">
//       <div>
//         <Label>Display Name</Label>
//         <Input
//           value={data.displayName}
//           onChange={(e) => setData({ ...data, displayName: e.target.value })}
//           onBlur={handleBlur}
//         />
//       </div>
//       <div>
//         <Label>Database Type</Label>
//         <Select value={data.type} onValueChange={(value) => {
//           setData({ ...data, type: value });
//           handleBlur();
//         }}>
//           <SelectTrigger>
//             <SelectValue placeholder="Select type" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="postgres">PostgreSQL</SelectItem>
//             <SelectItem value="mysql">MySQL</SelectItem>
//             <SelectItem value="mssql">SQL Server</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <Label>Username</Label>
//           <Input
//             value={data.username}
//             onChange={(e) => setData({ ...data, username: e.target.value })}
//             onBlur={handleBlur}
//           />
//         </div>
//         <div>
//           <Label>Password</Label>
//           <Input
//             type="password"
//             value={data.password}
//             onChange={(e) => setData({ ...data, password: e.target.value })}
//             onBlur={handleBlur}
//           />
//         </div>
//       </div>
//       <div>
//         <Label>Hostname</Label>
//         <Input
//           value={data.hostname}
//           onChange={(e) => setData({ ...data, hostname: e.target.value })}
//           onBlur={handleBlur}
//         />
//       </div>
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <Label>Port</Label>
//           <Input
//             value={data.port}
//             onChange={(e) => setData({ ...data, port: e.target.value })}
//             onBlur={handleBlur}
//           />
//         </div>
//         <div>
//           <Label>Database Name</Label>
//           <Input
//             value={data.name}
//             onChange={(e) => setData({ ...data, name: e.target.value })}
//             onBlur={handleBlur}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

export default function DatabasesPage() {
  return (
    <div className="bg-white p-4 rounded-lg border bg-card text-card-foreground shadow flex flex-col min-h-[500px] w-full">
      <PageHeader
        heading="Database Configuration"
        subtext="Manage your database connections"
      />
      
      <DatabaseTabs />
    </div>
  );
}
