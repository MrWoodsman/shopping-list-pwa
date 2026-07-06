import { useState } from "react";

export function useGroup() {
  // Przy starcie aplikacji sprawdzamy, czy w pamięci telefonu jest zapisany kod
  const [groupId, setGroupId] = useState<string | null>(() => localStorage.getItem("groupId"));

  // Funkcja dołączania / tworzenia
  const joinGroup = (id: string) => {
    localStorage.setItem("groupId", id);
    setGroupId(id);
  };

  // Funkcja opuszczania
  const leaveGroup = () => {
    localStorage.removeItem("groupId");
    setGroupId(null);
  };

  return { groupId, joinGroup, leaveGroup };
}
