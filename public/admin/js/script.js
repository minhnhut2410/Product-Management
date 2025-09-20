//Button Status
const buttonStatus = document.querySelectorAll("[button-status]")
if (buttonStatus.length > 0) {
    buttonStatus.forEach(button => {
        let url = new URL(window.location.href);
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            if (status) {
                console.log("hi");
                url.searchParams.set("status", status);

            } else {
                url.searchParams.delete("status");
            }
            window.location.href = url;

        })

    })
    //Form Search
    const formSearch = document.querySelector("#form-search");
    if (formSearch) {
        let url = new URL(window.location.href);
        formSearch.addEventListener("submit", (e) => {
            const keyword = e.target.elements.keyword.value;
            e.preventDefault();
            if (keyword) {
                url.searchParams.set("keyword", keyword);

            } else {
                url.searchParams.delete("keyword");
            }
            window.location.href = url.href;
        })

    }
}
//Form search

//Pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
if (buttonPagination) {
    let url = new URL(window.location.href);
    buttonPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");
            url.searchParams.set("page", page);
            window.location.href = url.href;
        })
    })
}
//End Pagination

//Checkbox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");
    inputCheckAll.addEventListener("click", () => {
        if (inputCheckAll.checked) {
            inputsId.forEach(input => {
                input.checked = true;
            })
        } else {
            inputsId.forEach(input => {
                input.checked = false;
            })
        }
    })

    inputsId.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
            const inputLength = inputsId.length;
            if (countChecked == inputLength) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        })
    })
}
//End Checkbox Multi

//Form Change Multi
const formChangeMulti = document.querySelector(".form-change-multi");
if (formChangeMulti) {

    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        const checkboxMulti = document.querySelector("[checkbox-multi]");
        const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");

        const typeAction = e.target.elements.type.value;
        if (typeAction == "delete-all") {
            const isConfirm = confirm("Do you want to delete all these items?");
            if (!isConfirm) {
                return;
            }
        }
        if (inputsChecked.length > 0) {
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");
            inputsChecked.forEach(input => {
                const id = input.value;
                if (typeAction == "change-position") {
                    const position = input.closest("tr").querySelector("input[name='position']").value;
                    ids.push(`${id}-${position}`);
                } else {
                    ids.push(input.value);
                }
            });
            inputIds.value = ids.join(",");
            formChangeMulti.submit();
        } else {
            alert("Please choose at least one record!");
        }
    })
}

//End Form Change Multi

//Short Alert
const showAlert = document.querySelector("[show-alert]");
if(showAlert){
    const time = parseInt(showAlert.getAttribute("data-time"));
     setTimeout(() => {
        showAlert.classList.add("alert-hidden");
     }, time);
    const closeAlert = showAlert.querySelector("[close-alert]");
    closeAlert.addEventListener("click", () =>{
        showAlert.classList.add("alert-hidden");
    })

}
//End Short Alert
