# Dynamic Workflow Tabs System

## Overview

The workflow header tabs have been transformed from hardcoded dummy data to a dynamic, VS Code-like tab system that displays uploaded files from the Documents and Forms tabs.

## Features

### 🔄 Dynamic Tab Creation

- Tabs are automatically created from uploaded files
- Each tab represents a file from Documents (Petitioner/Beneficiary) or Forms
- No more hardcoded dummy tabs

### 🎯 File Integration

- **Documents Tab**: Petitioner and Beneficiary files can be added to workflow
- **Forms Tab**: PDF forms can be added to workflow
- Files maintain their type association (P/B/F indicators)

### 🖱️ User Interactions

#### Drag & Drop

- Drag files from Documents/Forms tabs to the workflow header
- Visual feedback when dragging over the header area
- Drop zones clearly indicated

#### Double-Click

- Double-click any file in Documents/Forms to open it in workflow
- Instantly creates a new tab and makes it active

#### Tab Management

- Click tabs to switch between files
- Close button appears on hover (×)
- Drag tabs to reorder them
- Automatic tab activation when created

### 📁 File Display

The WorkflowBody component now displays file content based on type:

#### PDF Files

- Embedded PDF viewer using iframe
- Full document display within the workflow

#### Images

- Centered image display with proper scaling
- Supports all common image formats

#### Text Files

- Syntax highlighting for text content
- Scroll support for long files

#### Other Files

- File information display
- Download button for unsupported types

### 🎨 Visual Indicators

#### Tab Appearance

- File type icons (📄 for PDFs, 🖼️ for images)
- Type badges (P = Petitioner, B = Beneficiary, F = Form)
- Color-coded badges (Blue/Green/Purple)
- Active tab highlighting

#### Drag Feedback

- Header background changes during drag operations
- Border animation when files can be dropped
- Clear visual cues for valid drop zones

## Technical Implementation

### Store Management

- `documentsStore.ts` extended with workflow tab functionality
- Zustand state management for tab persistence
- Automatic duplicate handling

### Components Updated

- `WorkFlowHeader.tsx`: Dynamic tab rendering and drag handling
- `WorkflowBody.tsx`: File content display system
- `DocumentsTab.tsx`: Drag source functionality
- `FormsTab.tsx`: Drag source functionality

### Key Functions

- `addWorkflowTab()`: Creates new tab from file
- `removeWorkflowTab()`: Closes tab
- `setActiveWorkflowTab()`: Switches active tab
- `reorderWorkflowTabs()`: Drag reordering

## Usage

1. **Upload files** to Documents or Forms tabs
2. **Drag files** from the file lists to the workflow header, OR
3. **Double-click files** to open them directly in workflow
4. **Switch between tabs** by clicking them
5. **Close tabs** using the × button that appears on hover
6. **Reorder tabs** by dragging them within the header

## Benefits

- ✅ Eliminates hardcoded dummy data
- ✅ Seamless file-to-workflow integration
- ✅ Intuitive VS Code-like interface
- ✅ Supports multiple file types
- ✅ Visual feedback and clear UX
- ✅ Persistent tab state
- ✅ Efficient file management
