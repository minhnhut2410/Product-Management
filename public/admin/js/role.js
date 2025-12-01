const buttonsDelete = document.querySelectorAll("[button-delete]");

if (buttonsDelete.length > 0) {
    const formDeleteItem = document.querySelector("#form-delete-item");
    const path = formDeleteItem.getAttribute("data-path");

    buttonsDelete.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Do you want to delete this item?");
            
            if (isConfirm) {
                const id = button.getAttribute("data-id");
                
                const action = `${path}/${id}?_method=DELETE`;
                
                formDeleteItem.action = action;
                formDeleteItem.submit();
            }
        });
    });
}

//Role-Permission

// /public/admin/js/permissions.js

const tablePermissions = document.querySelector("[table-permissions]");

if(tablePermissions) {
    const buttonSubmit = document.querySelector("[button-submit]");
    
    buttonSubmit.addEventListener("click", (e) => {
        // Prevent default submit immediately so we can calculate data
        // (Though if button is type="button" strictly, this isn't needed, 
        // but safe to keep if it's inside a form)
        
        let permissions = [];
        
        // 1. Get all rows
        const rows = tablePermissions.querySelectorAll("[data-name]");
        
        // 2. iterate through the rows to process data
        rows.forEach(row => {
            const name = row.getAttribute("data-name");
            const inputs = row.querySelectorAll("input");

            // Case A: This is the hidden "id" row
            if (name == "id") {
                inputs.forEach(input => {
                    const id = input.value;
                    permissions.push({
                        id: id,
                        permissions: []
                    });
                });
            } 
            // Case B: This is a permission row (view, create, etc)
            else {
                inputs.forEach((input, index) => {
                    // Check if the box is checked
                    if (input.checked) {
                        // 'index' corresponds to the column (Role) index
                        // We push this permission name into the correct Role object
                        permissions[index].permissions.push(name);
                    }
                });
            }
        });

        // 3. Put the array into the hidden input
        const formChangePermissions = document.querySelector("#form-change-permissions");
        const inputPermissions = formChangePermissions.querySelector("input[name='permissions']");
        
        // Convert array to JSON string
        inputPermissions.value = JSON.stringify(permissions);

        // 4. Submit the form
        formChangePermissions.submit();
    });
}