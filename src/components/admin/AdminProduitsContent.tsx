"use client";

import { useState } from "react";
import { AdminFamiliesManager } from "@/components/admin/AdminFamiliesManager";
import { AdminPhotosManager } from "@/components/admin/AdminPhotosManager";

export function AdminProduitsContent() {
  const [photosRefreshKey, setPhotosRefreshKey] = useState(0);

  return (
    <div className="space-y-8">
      <AdminFamiliesManager onDataChange={() => setPhotosRefreshKey((k) => k + 1)} />
      <AdminPhotosManager mode="list" key={`list-${photosRefreshKey}`} />
    </div>
  );
}
