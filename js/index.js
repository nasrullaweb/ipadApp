const photoCollageCntr = document.getElementsByClassName('photoCollage')[0];
const cntBlock = document.getElementsByClassName('contentBlock')[0];
const makeYourPledge = document.getElementById('makeYourPledge');
const chooseYourPledge = document.getElementById('chooseYourPledge');
const chooseYourPhoto = document.getElementById('chooseYourPhoto');
const popupCntr = document.getElementById('popupCntr');
const emailAndShare = document.getElementById('emailAndShare');
let imageList;
//2048 x 1536

function apiRequest(method, url) {
    return new Promise(function (resolve, reject) {
        let api = new XMLHttpRequest();
        api.open(method, url);
        api.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                resolve(JSON.parse(api.response));
            } else {
                reject({
                    status: this.status,
                    statusText: api.statusText
                });
            }
        };
        api.send();
    });
}

function InitializePhotoCollage() {
    // Setting default images as background
    for(let i=0; i<520; i++){
        const div = document.createElement('div');
        // div.style = `background: url(../images/defaultSliderImg.png) no-repeat center; background-size: cover;`;
        photoCollageCntr.append(div)
    }

    //API to get original images
    // apiRequest('GET', `http://10.190.109.90:8080/photo`)
    apiRequest('GET', `https://stark-headland-72310.herokuapp.com/photo`)
    .then(function (response) {
      addimagetag(response);
    }, function (error) {
        console.log(error.statusText);
    }).catch(function (error) {
        console.log(error);
    });
}

function getImgUrl(inx){
    let arrayBuffer, base64;
    arrayBuffer = imageList[inx].data.data;
    base64 = btoa(
        new Uint8Array(arrayBuffer)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    return `data:image/png;base64,${base64}`;
}

function addimagetag(response) {
    // setting renspone for global use
    imageList = response;

    let inx;
    let url;
    const photoCollageNodes = photoCollageCntr.childNodes;
    // photoCollageCntr.innerHTML="";
    for(let i=0; i<520; i++){
        // const div = document.createElement('div');

        inx = Math.round(Math.random() * (imageList.length -1));
        // inx = Math.round(Math.random() * 6);
        url = getImgUrl(inx);
        // test[i].style = `background: url(../images/${inx}.jpg) no-repeat center; background-size: cover;`;
        // div.style = `background: url(${url}) no-repeat center; background-size: cover;`;
        photoCollageNodes[i].style = `background-image: url(${url});`;
        // photoCollageCntr.append(div)
    }
}

InitializePhotoCollage();
// setInterval(function(){
//     photoCollageCntr.innerHTML="";
//     InitializePhotoCollage();
// },5000);

if (makeYourPledge) {
    makeYourPledge.addEventListener('click', function(){
        if (imageList.length > 0) {
            chooseYourPhoto.classList.remove('displayNone');
            document.getElementById('homeCntr').classList.add('displayNone');
            setTimeout(function(){
                // cntBlock.style = 'transform: scale(3)';
                cntBlock && cntBlock.classList.add('transition');
                loadSliderImages();
                const owl = $('.owl-carousel');
                owl.owlCarousel({
                    items:4,
                    margin:3,
                    dots: false,
                    nav: true,
                    navText: ["", ""]
                });
                
                initializeNavigation();
            },500);
        }
    });
}

const carouselTop = document.querySelector('.carouselTop .owl-carousel');
const carouselBottom = document.querySelector('.carouselBottom .owl-carousel');
let carouselTopCnt ='';
let carouselBottomCnt = '';
function loadSliderImages() {
    let url;
    carouselTop.innerHTML = '';
    carouselBottom.innerHTML = '';
    if (imageList.length > 8) {
        for(let i=0; i<imageList.length; i++){
            url = getImgUrl(i);
            carouselTopCnt +=`<div class="sliderItem"><img src='${url}'></div>`;
            if (++i < imageList.length){
                url = getImgUrl(i);
                carouselBottomCnt +=`<div class="sliderItem"><img src='${url}'></div>`;
            } else {
                carouselBottomCnt +=`<div class="sliderItem"></div>`;
            }
        }
    } else {
        for(let i=0; i<8; i++){
            if (i < imageList.length){
                url = getImgUrl(i);
                carouselTopCnt +=`<div class="sliderItem"><img src='${url}'></div>`;
            } else {
                carouselTopCnt +=`<div class="sliderItem"></div>`;
            }

            if (++i < imageList.length){
                url = getImgUrl(i);
                carouselBottomCnt +=`<div class="sliderItem"><img src='${url}'></div>`;
            } else {
                carouselBottomCnt +=`<div class="sliderItem"></div>`;
            }
        }
    }
    carouselTop.innerHTML = carouselTopCnt;
    carouselBottom.innerHTML = carouselBottomCnt;
}

function initializeNavigation() {
    let sliderLeftNav = document.getElementsByClassName('owl-prev');
    let sliderRightNav = document.getElementsByClassName('owl-next');

    sliderLeftNav[0].addEventListener('click', function(){
        sliderLeftNav[1] && $(sliderLeftNav[1]).trigger('click');
    });
    
    sliderRightNav[0].addEventListener('click', function(){
        sliderRightNav[1] && $(sliderRightNav[1]).trigger('click');
    });

    setTimeout(function(){
        cntBlock.classList.add('enableSlider');
        const sliderItems = document.querySelectorAll('.sliderItem img');
        const imgCntr = document.querySelector('.yourPhoto img');
        sliderItems.forEach(function(item){
            item.addEventListener('click', function(){
                // alert(this.children[0].getAttribute('src'));
                chooseYourPledge.classList.remove('displayNone');
                imgCntr.src = this.getAttribute('src');
                chooseYourPhoto.classList.add('displayNone');
            })
        })
    },1000)
    
}

const pledgeList = document.querySelectorAll('.yourPledgCntr li');
let myPledge = '';
pledgeList.forEach(function(item){
    item.addEventListener('click', function(event){
        const popup = document.querySelector('.popup');
        const selectedPledge = document.querySelector('.selectedPledge');
        const pledgeCntr = document.querySelector('.confirmPledgeCntr span');
        let pludge = event.target.innerText;
        let left = event.target.offsetLeft;
        let top = event.target.offsetTop;
        let width = event.target.offsetWidth;
        let height = event.target.offsetHeight;

        popupCntr.classList.remove('displayNone');
        selectedPledge.innerHTML = pludge;
        pledgeCntr.innerHTML = pludge;
        let cnrtwidth = popup.offsetWidth;
        if (event.target.parentElement.classList.contains('right')){
            popup.style = `top: ${top}px; left: ${left + width - cnrtwidth}px;`;
            selectedPledge.style = `width: ${width}px; height: ${height}px; margin-left: ${cnrtwidth - width}px`;
        } else {
            popup.style = `top: ${top}px; left: ${left}px;`;
            selectedPledge.style = `width: ${width}px; height: ${height}px;`;
        }
        // popupCntr.classList.remove('displayNone');
    });
});

const chooseAnother = document.querySelector('.chooseAnother');
if (chooseAnother) {
    chooseAnother.addEventListener('click', function(){
        popupCntr.classList.add('displayNone');
    });
}

const chooseThis = document.querySelector('.chooseThis');
const imgCntr = document.querySelector('.yourPhoto img');
const photoFrame = document.querySelector('.photoCntr img');
if (chooseThis) {
    chooseThis.addEventListener('click', function(event){
        myPledge = event.target.parentElement.children[0].innerText;
        document.querySelector('.myPledgeText').innerText = myPledge;
        chooseYourPledge.classList.add('displayNone');
        emailAndShare.classList.remove('displayNone');
        photoFrame.src = imgCntr.src;
        popupCntr.classList.add('displayNone');
    });
}

const submitYourPledge = document.querySelector('.submitYourPledge');
if (submitYourPledge) {
    submitYourPledge.addEventListener('click', function(){
        if (document.querySelector('.myPledge').value) {
            myPledge = 'I pledge to Be ' + document.querySelector('.myPledge').value + '.';
            document.querySelector('.myPledgeText').innerText = myPledge;
            chooseYourPledge.classList.add('displayNone');
            emailAndShare.classList.remove('displayNone');
            photoFrame.src = imgCntr.src;
        } 
    });
}


const goBack = document.querySelector('.goBack');

if (goBack) { 
    goBack.addEventListener('click', function(event){
        myPledge = "";
        chooseYourPledge.classList.remove('displayNone');
        emailAndShare.classList.add('displayNone');
    });
}
