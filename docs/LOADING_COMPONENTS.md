# Loading Components Usage Guide

This guide shows how to use the new loading state components throughout the application.

## Components Overview

### 1. **Spinner** - Simple loading spinners

```tsx
import { Spinner, ButtonSpinner } from '@/components/ui'

// Basic spinner
<Spinner size="md" color="primary" />

// In buttons
<button>
  <ButtonSpinner />
  Loading...
</button>
```

**Sizes**: `xs`, `sm`, `md`, `lg`, `xl`  
**Colors**: `primary`, `secondary`, `white`, `gray`

---

### 2. **Skeleton** - Placeholder loading states

```tsx
import {
  Skeleton,
  CardSkeleton,
  CourseCardSkeleton,
  StatsCardSkeleton
} from '@/components/ui'

// Basic skeleton
<Skeleton variant="text" width="75%" height={20} />
<Skeleton variant="circular" width={48} height={48} />
<Skeleton variant="rounded" height={200} />

// Pre-built skeletons
<CourseCardSkeleton />
<StatsCardSkeleton />
<CardSkeleton />
```

**Variants**: `text`, `circular`, `rectangular`, `rounded`  
**Animations**: `pulse`, `wave`, `none`

---

### 3. **LoadingButton** - Buttons with loading states

```tsx
import { LoadingButton } from "@/components/ui";

<LoadingButton
  loading={isSubmitting}
  loadingText="Saving..."
  variant="primary"
  size="lg"
  fullWidth
  onClick={handleSubmit}
>
  Save Changes
</LoadingButton>;
```

**Variants**: `primary`, `secondary`, `danger`, `success`, `outline`  
**Sizes**: `sm`, `md`, `lg`

---

### 4. **ProgressBar** - Progress indicators

```tsx
import {
  ProgressBar,
  CircularProgress,
  FileUploadProgress
} from '@/components/ui'

// Linear progress
<ProgressBar
  progress={75}
  showLabel
  label="Uploading..."
  color="primary"
/>

// Circular progress
<CircularProgress
  progress={60}
  size={120}
  showLabel
/>

// File upload progress
<FileUploadProgress
  fileName="document.pdf"
  progress={45}
  size="2.5 MB"
  status="uploading"
  onCancel={handleCancel}
/>
```

**Colors**: `primary`, `success`, `warning`, `danger`

---

### 5. **LoadingState** - Page-level loading

```tsx
import { LoadingState } from '@/components/ui'

// Full screen loading
<LoadingState type="spinner" fullScreen message="Loading data..." />

// Skeleton cards
<LoadingState type="card" count={6} />

// Stats loading
<LoadingState type="stats" count={4} />

// Table loading
<LoadingState type="table" count={10} />

// List loading
<LoadingState type="list" count={5} />
```

---

## Real-World Examples

### Example 1: Form Submission

```tsx
"use client";

import { useState } from "react";
import { LoadingButton } from "@/components/ui";

export default function MyForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/submit", { method: "POST" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}

      <LoadingButton
        type="submit"
        loading={loading}
        loadingText="Submitting..."
        variant="primary"
        size="lg"
        fullWidth
      >
        Submit
      </LoadingButton>
    </form>
  );
}
```

### Example 2: Data Fetching with Skeleton

```tsx
"use client";

import { useState, useEffect } from "react";
import { CourseCardSkeleton } from "@/components/ui";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses().then((data) => {
      setCourses(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
```

### Example 3: File Upload with Progress

```tsx
"use client";

import { useState } from "react";
import { FileUploadProgress } from "@/components/ui";

export default function FileUploader() {
  const [uploads, setUploads] = useState([]);

  const handleUpload = async (file: File) => {
    const uploadId = Date.now();

    setUploads((prev) => [
      ...prev,
      {
        id: uploadId,
        fileName: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        progress: 0,
        status: "uploading",
      },
    ]);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setUploads((prev) =>
        prev.map((u) => (u.id === uploadId ? { ...u, progress: i } : u))
      );
    }

    setUploads((prev) =>
      prev.map((u) => (u.id === uploadId ? { ...u, status: "success" } : u))
    );
  };

  return (
    <div className="space-y-4">
      <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />

      {uploads.map((upload) => (
        <FileUploadProgress
          key={upload.id}
          fileName={upload.fileName}
          progress={upload.progress}
          size={upload.size}
          status={upload.status}
          onCancel={() => {
            /* cancel logic */
          }}
        />
      ))}
    </div>
  );
}
```

### Example 4: Dashboard Stats Loading

```tsx
"use client";

import { useState, useEffect } from "react";
import { StatsCardSkeleton } from "@/components/ui";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <StatsCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}
```

### Example 5: Page-Level Loading

```tsx
"use client";

import { useState, useEffect } from "react";
import { LoadingState } from "@/components/ui";

export default function ExamsPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams().then((data) => {
      setExams(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <LoadingState type="card" count={6} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {exams.map((exam) => (
        <ExamCard key={exam.id} exam={exam} />
      ))}
    </div>
  );
}
```

### Example 6: Optimistic UI Update

```tsx
"use client";

import { useState } from "react";
import { LoadingButton } from "@/components/ui";

export default function LikeButton({ postId, initialLiked }) {
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    // Optimistic update
    setLiked(!liked);
    setLoading(true);

    try {
      await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    } catch (error) {
      // Revert on error
      setLiked(!liked);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoadingButton
      loading={loading}
      variant={liked ? "primary" : "outline"}
      size="sm"
      onClick={handleLike}
    >
      {liked ? "❤️ Liked" : "🤍 Like"}
    </LoadingButton>
  );
}
```

### Example 7: Table with Skeleton Loading

```tsx
"use client";

import { TableRowSkeleton } from "@/components/ui";

export default function StudentsTable({ loading, students }) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Enrolled</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRowSkeleton key={i} columns={4} />
            ))}
          </>
        ) : (
          students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.enrolledDate}</td>
              <td>
                <button>Edit</button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
```

## Best Practices

### 1. **Use Skeleton for Content Loading**

Replace "Loading..." text with skeleton loaders that match your content structure.

```tsx
// ❌ Bad
{
  loading && <p>Loading courses...</p>;
}

// ✅ Good
{
  loading && <CourseCardSkeleton />;
}
```

### 2. **Use LoadingButton for Actions**

Always show loading state in action buttons.

```tsx
// ❌ Bad
<button disabled={loading}>
  {loading ? 'Saving...' : 'Save'}
</button>

// ✅ Good
<LoadingButton loading={loading} loadingText="Saving...">
  Save
</LoadingButton>
```

### 3. **Show Progress for Long Operations**

Use progress bars for file uploads and long-running tasks.

```tsx
<FileUploadProgress
  fileName={file.name}
  progress={uploadProgress}
  status="uploading"
/>
```

### 4. **Optimistic UI Updates**

Update UI immediately, revert on error.

```tsx
// Update UI first
setLiked(true);

// Then make API call
try {
  await api.like();
} catch {
  setLiked(false); // Revert on error
}
```

### 5. **Match Skeleton to Content**

Skeleton loaders should closely match the actual content layout.

```tsx
// For a card with image, title, and description
<div className="card">
  <Skeleton variant="rectangular" height={200} />
  <Skeleton variant="text" height={24} className="mt-4" />
  <Skeleton variant="text" height={16} className="mt-2" />
</div>
```

## Migration Guide

### Updating Existing Pages

**Before:**

```tsx
{
  loading && <p>Loading...</p>;
}
```

**After:**

```tsx
import { LoadingState } from "@/components/ui";

{
  loading && <LoadingState type="card" count={6} />;
}
```

**Before:**

```tsx
<button disabled={loading}>{loading ? "Submitting..." : "Submit"}</button>
```

**After:**

```tsx
import { LoadingButton } from "@/components/ui";

<LoadingButton loading={loading} loadingText="Submitting...">
  Submit
</LoadingButton>;
```

## Component Props Reference

### Spinner

- `size`: `'xs' | 'sm' | 'md' | 'lg' | 'xl'`
- `color`: `'primary' | 'secondary' | 'white' | 'gray'`
- `className`: `string`

### Skeleton

- `variant`: `'text' | 'circular' | 'rectangular' | 'rounded'`
- `width`: `string | number`
- `height`: `string | number`
- `animation`: `'pulse' | 'wave' | 'none'`
- `className`: `string`

### LoadingButton

- `loading`: `boolean`
- `loadingText`: `string`
- `variant`: `'primary' | 'secondary' | 'danger' | 'success' | 'outline'`
- `size`: `'sm' | 'md' | 'lg'`
- `fullWidth`: `boolean`
- All standard button props

### ProgressBar

- `progress`: `number` (0-100)
- `size`: `'sm' | 'md' | 'lg'`
- `color`: `'primary' | 'success' | 'warning' | 'danger'`
- `showLabel`: `boolean`
- `label`: `string`
- `animated`: `boolean`

### LoadingState

- `type`: `'spinner' | 'skeleton' | 'card' | 'stats' | 'list' | 'table' | 'custom'`
- `count`: `number`
- `message`: `string`
- `fullScreen`: `boolean`
- `className`: `string`
