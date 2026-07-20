import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Folder } from "lucide-react";
import { workspaceService } from "../../workspace/services/workspace.api";
import { useWorkspaceStore } from "../../../store/workspace.store";
import { Button } from "../../../ui/button/Button";
import { Card, CardHeader, CardTitle, CardDescription } from "../../../ui/card/Card";
import { Spinner } from "../../../ui/spinner/Spinner";
import { useAbortController } from "../../../hooks/useAbortController";

export const Dashboard = () => {
  const { workspaces, setWorkspaces } = useWorkspaceStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { getSignal } = useAbortController();

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setIsLoading(true);
        const data = await workspaceService.getWorkspaces(getSignal());
        setWorkspaces(data);
      } catch (err: any) {
        if (err.name !== "CanceledError") {
          setError("Failed to load workspaces.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspaces();
  }, [setWorkspaces, getSignal]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-default)]">Your Workspaces</h2>
          <p className="text-[var(--text-muted)] mt-1">Manage your projects and documents here.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Workspace
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-[var(--color-error-600)] p-4 rounded-md">{error}</div>
      ) : workspaces.length === 0 ? (
        <div className="text-center py-16 px-4 sm:px-6 lg:px-8 border-2 border-dashed border-[var(--border-default)] rounded-xl">
          <Folder className="mx-auto h-12 w-12 text-[var(--text-muted)]" />
          <h3 className="mt-2 text-sm font-semibold text-[var(--text-default)]">No workspaces</h3>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Get started by creating a new workspace.</p>
          <div className="mt-6">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Workspace
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace) => (
            <Link key={workspace.id} to={`/workspace/${workspace.id}`} className="block group">
              <Card className="h-full transition-shadow hover:shadow-md border-[var(--border-default)] bg-[var(--bg-surface)]">
                <CardHeader>
                  <CardTitle className="text-lg text-[var(--text-default)] group-hover:text-[var(--color-primary-500)] transition-colors">
                    {workspace.name}
                  </CardTitle>
                  <CardDescription className="mt-2 text-[var(--text-muted)]">
                    {workspace.description || "No description provided."}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
