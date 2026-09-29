export default function decorate(block){
    const card = document.querySelector(".newpage");
    [...card.children].forEach((row)=>{
        row.classList.add("inner-card")

    })
};