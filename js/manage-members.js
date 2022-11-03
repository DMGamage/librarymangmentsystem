const txtContact=document.getElementById('txt-contact');
const txtName=document.getElementById('txt-name');
const txtAddress=document.getElementById('txt-address');
const btnSave=document.getElementById('btn-save');

const regExp4Name = /^[A-Za-z ]+$/;
const regExp4Address = /^[A-Za-z0-9:.,/\- ]+$/;
const regExp4Contact = /^\d{3}-\d{7}$/;


btnSave.addEventListener('click', ()=>{


if (!regExp4Name.test(txtName.value.trim())){
    txtName.classList.add('is-invalid');
    if (!invalidInput) invalidInput = txtName;
}  
if (!regExp4Address.test(txtAddress.value.trim())){
    txtAddress.classList.add('is-invalid');
    if (!invalidInput) invalidInput = txtAddress;
}
if (!regExp4Contact.test(txtContact.value)){
    txtContact.classList.add('is-invalid');
    if (!invalidInput) invalidInput = txtContact;
}       

});

const page_size = 5;
let page =1;
getMembers()

/* (1) Initialize a XMLHttpRequest object */
function getMembers(query=`${$('#txt-search').val()}`){
const http = new XMLHttpRequest();




/* (2) set an event listener to detect state change */
http.addEventListener('readystatechange', ()=> {
    if(http.readyState === http.DONE){
        if(http.status === 200){
            const totalMembers = +http.getResponseHeader('X-Total-Count');
            initPagination(totalMembers);
            // console.log(http.responseText);
            $('#tbl-members tbody tr').remove();
            const members = JSON.parse(http.responseText);
            if(members.length===0){
                $('#tbl-members').addClass('empty');
            }else{
                $('#tbl-members').removeClass('empty');

            }
            members.forEach(member => {
                const rowHtml = `
                <tr tabindex="0">
                    <td>${member.id}</td>
                    <td>${member.name}</td>
                    <td>${member.address}</td>
                    <td>${member.contact}</td>
                </tr>
            `;
            $('#tbl-members tbody').append(rowHtml);
            });
            
        }else{
            $('#toast').show();
            // console.error('Something went wrong');
        }
    }
});

/* (3) Open the request */
http.open(`GET`, `http://localhost:8080/lms/api/members?size=${page_size}&page=${page}&q=${query}`, true);

/* (4) Set additioanl information for the request (can get from documentation)*/


/* (5) Send the request */
http.send();

}


function initPagination(totalMembers){
    const totalPages = Math.ceil(totalMembers/page_size);

    if(totalPages <=1){
        $("#pagination").addClass('d-none');
    }else{
        $("#pagination").removeClass('d-none');

    }


    

    let html= '';

    for(let i=1;i<=totalPages;i++){
        html += `<li class="page-item ${i===page?'active':''}"><a class="page-link" href="#">${i}</a></li>`

    }
     html =`
              <li class="page-item ${page===1?'disabled':''}"><a class="page-link" href="#">Previous</a></li>
              ${html}
              <li class="page-item ${page===totalPages?'disabled':''}"><a class="page-link" href="#">Next</a></li>`;

              $('#pagination >.pagination').html(html);

}
$('#pagination >.pagination').click((eventData)=>{
    const elm = eventData.target;
    if(elm && elm.tagName ==='A'){

        const activePage = ($(elm).text());

        if(activePage ==='Next'){
            page++;
            getMembers();
        }else if(activePage === 'Previous'){
            page--;
            getMembers();
        }else{
            if(page!==activePage){
                page = +activePage;
                getMembers();

            }
            
        }
    }

});

$('#txt-search').on('input',()=>{
    page=1;
    getMembers();
})

$('#tbl-members tbody').keyup((eventData)=>{
    if(eventData.which==38){
        const elm = document.activeElement.previousElementSibling;
        if (elm instanceof HTMLTableRowElement){
            elm.focus();
        }
        

    }else if(eventData.which===40){
        const elm = document.activeElement.nextElementSibling;
        if (elm instanceof HTMLTableRowElement){
            elm.focus();
        }
    }
});

$(document).keydown((eventData)=>{
    if(eventData.ctrlKey && eventData.key ==='/'){
        $("#txt-search").focus();
    }
});

$("#btn-new-member").click(()=>{
    
    const frmMemberDetail = new 
                              bootstrap.Modal(document.getElementById('frm-member-detail'));
                              $("frm-member-detail").addClass('new').on('shown.bs.modal',()=>{
                                $("#txt-name").focus();
                              })
    frmMemberDetail.show();

    


});

$("#frm-member-detail form").submit((eventData)=>{
    eventData.preventDefault();
    $("#btn-save").click();
    ///fill this
});

$('#btn-save').click(async()=>{
    const name =$('#txt-name').val();
    const address =$('#txt-address').val();
    const contact =$('#txt-contact').val();
    let validated =true;

    $('#txt-name,#txt-address,#txt-contact').removeClass('is-invalid');

    if(!/^[A-Za-z ]+$/.test(name)){
        $('#txt-name').addClass('is-invalid').select().focus();
        validated=false;
    }

    if(!/^[A-Za-z0-9#|,.|;: ]+$/.test(address)){
        $('#txt-address').addClass('is-invalid').select().focus();
        validated=false;
    }
    if(!/^\d{3}-\d{7}$/.test(contact)){
        $('#txt-contact').addClass('is-invalid').select().focus();
        validated=false;

    }

    if(!validated) return;

    try{
        await saveMember();
        alert("Successfully Saved");
    }catch(e){
        alert('Failed to save the member');
    }
});

function saveMember(){
    return new Promise((resolve,reject)=>{
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('readystatechange',()=>{
            if(xhr.readyState === XMLHttpRequest.DONE){
                if(xhr.status ===201){
                    resolve();
                }else{
                    reject();
                }
            }
        });

        xhr.open('POST','http://localhost:8080/lms/api/members',true);
        xhr.setRequestHeader('Content-Type','application/json');

        const member ={
            name: $('#txt-name').val(),
            address: $('#txt-address').val(),
            contact: $('#txt-contact').val(),

        }
        xhr.send(JSON.stringify(member))
    });
}

// function doSomething(){

// function saveMember(){

//    return  new Promise((resolve , reject) =>{
        


//         setTimeout(()=> resolve(),5000);
//         setTimeout(()=> reject(),2000);

//     });


// }

// const promise = saveMember();

// promise.then(()=>{
//     console.log('Kiwwa wage Kara');

// }).catch(()=>{
//     console.log("Promise kale")

// })

// }


// doSomething();
// async function doSomething(){
//     try{
//         await saveMember();
//         console.log("Promise eka hithapu widihata una");
//     }catch(e){
//         console.log("Promise eka kala");
//     }
// }

// async function saveMember(){
//     setTimeout(()=>,5000);

// }


