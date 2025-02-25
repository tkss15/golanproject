"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Plus, X, Check } from "lucide-react";

interface EditableTopicsCardProps {
  topics: string[];
  projects: string[];
  isEditing: boolean;
  onChange: (newTopics: string[], newProjects: string[]) => void;  // Changed from onSave to onChange
}

export default function EditableTopicsCard({ topics, projects, isEditing, onChange }: EditableTopicsCardProps) {
  const [editedTopics, setEditedTopics] = useState<string[]>(topics);
  const [editedProjects, setEditedProjects] = useState<string[]>(projects);
  const [editingTopicIndex, setEditingTopicIndex] = useState<number | null>(null);
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null);
  const [newTopic, setNewTopic] = useState("");
  const [newProject, setNewProject] = useState("");

  // Reset to initial state when isEditing changes
  useEffect(() => {
    if (!isEditing) {
      setEditedTopics(topics);
      setEditedProjects(projects);
      setEditingTopicIndex(null);
      setEditingProjectIndex(null);
      setNewTopic("");
      setNewProject("");
    }
  }, [isEditing, topics, projects]);

  // Notify parent component whenever topics or projects change
  useEffect(() => {
    onChange(editedTopics, editedProjects);
  }, [editedTopics, editedProjects, onChange]);

  const handleEditTopic = (index: number, newValue: string) => {
    const newTopics = [...editedTopics];
    newTopics[index] = newValue;
    setEditedTopics(newTopics);
  };

  const handleEditProject = (index: number, newValue: string) => {
    const newProjects = [...editedProjects];
    newProjects[index] = newValue;
    setEditedProjects(newProjects);
  };

  const handleAddTopic = () => {
    if (newTopic.trim()) {
      setEditedTopics([...editedTopics, newTopic.trim()]);
      setNewTopic("");
    }
  };

  const handleAddProject = () => {
    if (newProject.trim()) {
      setEditedProjects([...editedProjects, newProject.trim()]);
      setNewProject("");
    }
  };

  const handleDeleteTopic = (index: number) => {
    setEditedTopics(editedTopics.filter((_, i) => i !== index));
  };

  const handleDeleteProject = (index: number) => {
    setEditedProjects(editedProjects.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          נושאים בטיפול מותנה של המועצה והנהגת היישוב
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {editedTopics.map((topic, index) => (
              <TableRow key={index}>
                <TableCell className="flex justify-between items-center">
                  {editingTopicIndex === index && isEditing ? (
                    <div className="flex items-center gap-2 w-full">
                      <Input
                        value={topic}
                        onChange={(e) => handleEditTopic(index, e.target.value)}
                        className="flex-grow"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setEditingTopicIndex(null)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center w-full">
                      <span>{topic}</span>
                      {isEditing && (
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setEditingTopicIndex(index)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteTopic(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {isEditing && (
              <TableRow>
                <TableCell>
                  <div className="flex gap-2">
                    <Input
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      placeholder="הוסף נושא חדש"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleAddTopic}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <div className="border-t my-4" />

      <CardHeader>
        <CardTitle>פרויקטים אזוריים משפיעים</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {editedProjects.map((project, index) => (
              <TableRow key={index}>
                <TableCell className="flex justify-between items-center">
                  {editingProjectIndex === index && isEditing ? (
                    <div className="flex items-center gap-2 w-full">
                      <Input
                        value={project}
                        onChange={(e) => handleEditProject(index, e.target.value)}
                        className="flex-grow"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setEditingProjectIndex(null)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center w-full">
                      <span>{project}</span>
                      {isEditing && (
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setEditingProjectIndex(index)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteProject(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {isEditing && (
              <TableRow>
                <TableCell>
                  <div className="flex gap-2">
                    <Input
                      value={newProject}
                      onChange={(e) => setNewProject(e.target.value)}
                      placeholder="הוסף פרויקט חדש"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleAddProject}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}