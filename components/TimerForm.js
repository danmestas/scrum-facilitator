function TimerForm({ onAddItem }) {
  // ... existing form handling code ...

  const handleSubmit = () => {
    // ... validation logic ...
    
    // After creating the item:
    onAddItem(newItem);  // Make sure this callback is properly passed from parent
    resetForm();
  };
} 