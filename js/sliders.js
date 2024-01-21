import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

let mqDownlg = window.matchMedia("(max-width: 991px)");

const giftsSwiper = new Swiper('.gifts-swiper', {
    direction: 'horizontal',
    loop: false,
    slidesPerView: 1.6,
    spaceBetween: 12,
    centeredSlides: true,
    centeredSlidesBounds: true,
    init: false,
    slidesOffsetBefore: 12,
    breakpoints: {
        // when window width is >= 768px
        768: {
            slidesPerView: 3
        }
    }
});

const rulesSwiper = new Swiper('.rules-swiper', {
    direction: 'horizontal',
    loop: false,
    slidesPerView: 1.6,
    spaceBetween: 12,
    // centeredSlides: true,
    // centeredSlidesBounds: true,
    init: false,
    slidesOffsetBefore: 12,
    modules: [Navigation],
    navigation: {
        nextEl: '.rules-swiper__button-next',
        prevEl: '.rules-swiper__button-prev',
    },
    breakpoints: {
        // when window width is >= 768px
        768: {
            slidesPerView: 3
        },
        // when window width is >= 992px
        992: {
            slidesPerView: 'auto',
            centeredSlides: false,
        }
    }
});

rulesSwiper.init()

if (mqDownlg.matches) {
    giftsSwiper.init();
}