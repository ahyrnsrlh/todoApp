import { useState } from "react";
import type { Todo } from "@/types/todo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface TodoProps {
  todo: Todo;
  onDelete: (id: number) => void;
  onToggle: (id: number, isCompleted: boolean) => void;
  onEdit: (id: number, newTitle: string) => void;
}

export default function Todo({ todo, onDelete, onToggle, onEdit }: TodoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedTitle.trim()) {
      onEdit(todo.id, editedTitle);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedTitle(todo.title);
    setIsEditing(false);
  };

  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1 gap-3">
            <Checkbox
              checked={todo.is_completed}
              onCheckedChange={(checked) => onToggle(todo.id, checked === true)}
              id={`todo-${todo.id}`}
            />
            {isEditing ? (
              <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
                <Input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="flex-1"
                  autoFocus
                />
                <Button type="submit" size="sm" variant="default">
                  Save
                </Button>
                <Button
                  type="button"
                  onClick={handleCancel}
                  size="sm"
                  variant="outline"
                >
                  Cancel
                </Button>
              </form>
            ) : (
              <label
                htmlFor={`todo-${todo.id}`}
                className={cn("flex-1 cursor-pointer", {
                  "line-through text-gray-500": todo.is_completed,
                })}
              >
                {todo.title}
              </label>
            )}
          </div>
          {!isEditing && (
            <div className="flex gap-2">
              <Button
                onClick={() => setIsEditing(true)}
                size="sm"
                variant="outline"
              >
                Edit
              </Button>
              <Button
                onClick={() => onDelete(todo.id)}
                size="sm"
                variant="destructive"
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
