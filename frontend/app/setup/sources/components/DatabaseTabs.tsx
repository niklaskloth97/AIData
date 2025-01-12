import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatabaseForm, DatabaseFormData } from "./DatabaseForm"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"

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

  const handleDelete = (id: string) => {
    setDatabases(databases.filter(db => db.id !== id));
    // Set active tab to the previous database or empty if none left
    const index = databases.findIndex(db => db.id === id);
    if (index > 0) {
      setActiveTab(databases[index - 1].id);
    } else if (databases.length > 1) {
      setActiveTab(databases[1].id);
    } else {
      setActiveTab("");
    }
  };

  // return (
  //   <div className="space-y-4">
  //     <div className="flex justify-end mb-4">
  //       <Button variant="outline" size="icon" onClick={addDatabase}>
  //         <Plus className="h-4 w-4" />
  //       </Button>
  //     </div>
      
  //     {databases.length === 0 ? (
  //       <div className="flex items-center justify-center min-h-[200px]">
  //         <p className="text-muted-foreground text-center max-w-md">
  //           Currently there is no database connected. Please connect a database (read-only).
  //           Then we are able to analyze the existing data.
  //         </p>
  //       </div>

  return (
    <div className="space-y-4">
      {databases.length === 0 ? (
        <div className="text-center py-8 space-y-4">
          <div className="flex justify-end">
            <Button variant="outline" size="icon" onClick={addDatabase}>
              <Plus className="h-4 w-4" /> 
            </Button>

            </div>
          <p className="text-muted-foreground">
          <div className="flex space-x-2">
            Currently there is no database connected. Please connect a database (read-only). Connecting databaes will yield better results than uploading database extractions. <br />
            
            Please click on the plus icon to add a new database.
            </div>
          </p>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              {databases.map(db => (
                <TabsTrigger key={db.id} value={db.id}>
                  {db.displayName}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={addDatabase}>
                <Plus className="h-4 w-4" />
              </Button>
              {activeTab && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogTitle>Delete Database</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this database configuration? This action cannot be undone.
                    </AlertDialogDescription>
                    <div className="flex justify-end space-x-2">
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(activeTab)}>
                        Delete
                      </AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
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
      )}
    </div>
  );
}