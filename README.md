# Precision Oncology Knowledge Graph: User Navigation Manual

This manual describes how to navigate, control, and interact with the Precision Oncology 3D Knowledge Graph application.

---

## 3D Graph Interaction

* **Rotate Camera**: Left-click and drag anywhere on the graph canvas.
* **Pan Camera**: Right-click and drag, or hold the Control key while left-clicking and dragging.
* **Zoom In/Out**: Scroll the mouse wheel or pinch-to-zoom on a trackpad.
* **Select Node**: Left-click directly on any node to isolate its relationships. This updates the right sidebar with clinical profile details.
* **Reset Selection**: Left-click on any empty space in the 3D graph canvas to clear the selection and restore the full cohort view.

---

## Toolbar and View Options

Located in the top-right corner of the application header:

* **Toggle Left Sidebar**: Show or hide the navigation, filter, and configuration panel.
* **Toggle Right Sidebar**: Show or hide the clinical profile details panel.
* **Toggle Fullscreen**: Expand the application view to cover the entire screen.
* **Layout Switcher**: Open the layout menu to reorganize nodes into structured patterns:
  * **Force**: Standard force-directed physics layout.
  * **Radial**: Arranges nodes in concentric rings by entity type.
  * **Clustered**: Group nodes visually by clinical category.
  * **Hierarchical**: Arranges nodes in vertical layers by structural depth.

---

## Left Sidebar Controls

* **Search**: Look up patients, genes, variants, or therapies using the autocomplete search bar.
* **Load Patients**: Use the dropdown or the progress dot indicator to change the patient load limit. Slicing this density optimizes graph performance.
* **Entity Filters**: Toggle individual node categories (Patient, Gene, Variant, Cancer Type, Drug, Clinical Trial, Biomarker) to filter them from the current view.
* **Graph Controller**:
  * **Link Distance**: Slider to adjust physical spacing between connected nodes.
  * **Charge Strength**: Slider to adjust repulsive force between nodes.
  * **Flow Particles**: Slider to control the speed of moving relationship status particles.
  * **Auto Rotate Camera**: Toggle slow orbital rotation of the camera.
  * **Render 3D Labels**: Toggle text labels directly in the 3D workspace.

---

## Right Sidebar Profiles

When a patient or other entity node is selected, this panel displays structured clinical information, variant statuses, treatment courses, and trial alignments. Click "Clear Selection" or click empty canvas space to close the details.
