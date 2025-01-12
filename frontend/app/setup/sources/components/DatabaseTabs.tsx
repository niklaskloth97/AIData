import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatabaseForm, DatabaseFormData } from "./DatabaseForm"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"

export function DatabaseTabs() {
  const [databases, setDatabases] = useState<DatabaseFormData[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");

  const addDatabase = () => {
    const newId = `db-${databases.length + 1}`;
    const newDatabase = {
      id: newId,
      displayName: `Database ${databases.length + 1}`,
      type: "",
      username: "",
      password: "",
      hostname: "localhost",
      port: "5432",
      name: ""
    };
    setDatabases([...databases, newDatabase]);
    setActiveTab(newId);
  };

  const handleSave = (id: string, data: DatabaseFormData) => {
    setDatabases(databases.map(db => 
      db.id === id ? { ...db, ...data } : db
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              {databases.map(db => (
                <TabsTrigger key={db.id} value={db.id}>
                  {db.displayName}
                </TabsTrigger>
              ))}
            </TabsList>
            <Button variant="outline" size="icon" onClick={addDatabase}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {databases.map(db => (
            <TabsContent key={db.id} value={db.id}>
              <DatabaseForm
                initialData={db}
                onSave={handleSave}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}