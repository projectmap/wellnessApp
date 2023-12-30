import { createGlobalStyle } from 'styled-components';
export const GlobalStyle = createGlobalStyle`

*{
    margin:0;
    padding:0; 
    box-sizing: border-box;
}

body{
    margin:0;
    padding:0;
    color:#131336;
    font-size:14px;
    line-height: initial;
    word-break:break-word;
    background-color:#fff;
}
}
ul,li{
    margin:0;
    padding:0;
    list-style:none;
}
a{
    color:#131336;
    text-decoration:none;
}
button,input,fieldset{
    border:none;
    background:none;
    outline:none;
}

img{
    width:100%;
    display:block;
}
table {
    width: 100%;
  }
.color-red{
color:#FF0000;
}
.text--green{
    background: linear-gradient(316.95deg, #27AE60 1.9%, #9EB643 78.18%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
}
.text--orange{
    background: linear-gradient(111.84deg, #FF6629 -16.1%, #F5822C 96.37%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
text-fill-color: transparent;
}
.text--blue{
    background: radial-gradient(70.1% 164.5% at 90.49% 88.73%, #519BD2 0%, #1A65B0 100%) /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
text-fill-color: transparent;
}
.color--green{
    color: #00B29E;
}
.slick-dots{
  bottom:-30px;
}
.slick-dots li{
    margin:0;
}
.slick-dots li button:before{
    font-size:12px;
}

.centerDiv {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
.marginTop24{
    margin-top:24px;
}
.minWidth290{
    min-width:290px
}
.cursor-pointer{
    cursor:pointer;
}

.hide-scrollbar::-webkit-scrollbar {
    display: none;  /* chrome */
  }
.hide-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }

.post-link-post{
  a{
    color:blue;
  }
 
}
  .post-link{
    a{
      color:blue;
    }
    a:hover{
      color:#147AE9;
    }
  }
.rounded-image{
  border-radius:50%;
  }
.make-blur{
      filter:blur(3px)
    }
.round-meal-image{
      border-radius:50%;
  }
  .blackNwhite{
    filter: grayscale(100%);
    -webkit-filter: grayscale(100%);
  }
  .hide{
      display:none
  }
  .showModalOnCenter{
    position:absolute;
    width:558px;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    z-index:9;
  }

  .showShareModalOnCenter{
    position:absolute;
    width:595px;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    z-index:9;
  }

  .common-backdrop{
    position:fixed;
    top:0;
    left:0;
    height:100%;
    width:100%;
    background:rgba(0,0,0,0.4);
  z-index:99;
}
.line-clamp {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;  
    overflow: hidden;
  }
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;  
    overflow: hidden;
  }
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;  
    overflow: hidden;
  }
  .follow-user{
    .slick-next {
      z-index:9;
      right:-3px;
    }
    .slick-prev{
      z-index:9;
      left:-1px;
      top:141px;
      transform:rotate(180deg);
    }
  }
  .width-home-feature-desc{
    width:270px;
    
  }
  .marginlf-auto{
    margin-left:auto;
    margin-right:auto;
  }

.CircularProgressBar {
  display: block;
  margin: auto;
}

.CircularProgressBar__background {
  fill: none;
}

.CircularProgressBar__progress {
  fill: none;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition: stroke-dashoffset 0.35s;
}

.CircularProgressBar__text {
  font-size: 20px;
  text-anchor: middle;
  dominant-baseline: central;
  fill: #3490dc;
  font-weight: bold;
}
.mb-8{
  margin-bottom:8px;
.Capitalize {
  text-transform:capitalize;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}

input[type=number] {
    -moz-appearance:textfield; /* Firefox */
}
.basic-multi-select{
  border:solid red;
  height:56px;
}

`;
