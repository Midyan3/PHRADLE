export const AddItem = ({newItem, setNewItem, HandleSubmit}) => {
  return (
    <>
    <div> 
        <div>
            <h1> Add New Item? </h1>
            {/*
            // Like this? 
            //
            // did i do the onsubmit right?
            // Yes, you did the onSubmit correctly. It will call the HandleSubmit function when the form is submitted.
            //Wait, why onsubmit on the form and not the button?
            // The onSubmit event is placed on the form element because it captures the submission of the entire form, regardless of which button is clicked to submit it. This is useful when you have multiple buttons or input fields in a form. Placing onSubmit on the form ensures that the event is triggered whenever the form is submitted, allowing you to handle the submission logic in one place.
            // Ohh I see, that makes sense!
            */}
            <form style={{display : "flex", justifyContent : "column"} } onSubmit={HandleSubmit}>
                <input
                    type = "text" // Whats the differemce newteen single vs double quotes?
                    // Single quotes and double quotes are functionally the same in JSX and JavaScript. It's mostly a matter of style and consistency.
                    //Any slight difference at all? Like in c++? 
                    // In C++, single quotes are used for character literals, while double quotes are used for string literals. In JSX and JavaScript, both can be used interchangeably for strings.
                    placeholder='Enter item'
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    required
                />
                <button type="submit" aria-label='Add Item'> Add Item </button>
            </form>

        </div>
    </div>
    </>
  )
}
// Did I do good with everything here?
// Yes, your AddItem component is well-structured and correctly implements the form submission logic. The use of props for managing state and handling events is appropriate. The only minor suggestion would be to ensure consistent naming conventions (e.g., "HandleSubmit" could be "handleSubmit" to follow camelCase convention). Otherwise, everything looks good!
export default AddItem; 