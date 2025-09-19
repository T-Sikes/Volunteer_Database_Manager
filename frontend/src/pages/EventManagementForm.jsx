function EventManagementForm() {
  return (
    <div>
      <h1>Event Management Form</h1>
      <form>
        <label style={{display:"block"}}>Name</label>
        <input
          type="text"
          required
          style={{display:"block"}}
        />
        <label style={{display:"block"}}>Description</label>
        <textarea style={{display:"block"}}></textarea>
        <button>Add Event</button>
        <button>Cancel</button>
      </form>
    </div>
  )
}

export default EventManagementForm