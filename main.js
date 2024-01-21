import './style.scss'
import Spoiler from './js/spoiler';
import './js/sliders';
import board from './js/board';
import signup from './js/signup';

document.addEventListener('DOMContentLoaded', async () => {
    new Spoiler();
    board()
    signup()
    
    const pageHeader = document.querySelector('#page-header')
    const toggleHeader = () => {
        let introHeight = document.querySelector('#page-intro').offsetHeight

        if (window.scrollY > introHeight) {
            pageHeader.classList.remove('hidden')
        } else {
            pageHeader.classList.add('hidden')
        }
    }

    let mqDownlg = window.matchMedia("(max-width: 991px)");

    if (mqDownlg.matches) {
        window.addEventListener('scroll', () => {
            toggleHeader()
        })
    
        toggleHeader()
    }

    const iOS = navigator.userAgent && navigator.userAgent.match(/(iPad|iPhone|iPod)/g);;
    if (iOS)
        document.head.querySelector('meta[name="viewport"]').content = "width=device-width, initial-scale=1, maximum-scale=1";
    else
        document.head.querySelector('meta[name="viewport"]').content = "width=device-width, initial-scale=1";
    
    const anchorLinks = document.querySelectorAll('a[href*="#"]')
    const anchors = {}
    for (const item of anchorLinks) {
        const hash = new URL(item.href).hash
        if(!anchors[hash]){
            anchors[hash] = document.querySelector(hash)
        }        
        item.addEventListener('click', e => {
            e.preventDefault()
            anchors[hash].scrollIntoView()
        })
    }

    const hash = window.parent.location.hash
    if(anchors[hash]){
        anchors[hash].scrollIntoView()
    }

    document.querySelector('#join-form-btn').addEventListener('click', () => {
        _tmr.push({ type: 'reachGoal', id: 3398841, goal: 'click_join_1'});
        ym(51446871,'reachGoal','click_join_1')
    })
    document.querySelector('#join-form-btn-2').addEventListener('click', () => {
        _tmr.push({ type: 'reachGoal', id: 3398841, goal: 'click_join_2'});
        ym(51446871,'reachGoal','click_join_2')
    })
    document.querySelector('#click_create_channel').addEventListener('click', () => {
        _tmr.push({ type: 'reachGoal', id: 3398841, goal: 'click_create_channel'});
        ym(51446871,'reachGoal','click_create_channel')
    })

    window.addEventListener('message', (e) => {
        let el = document.getElementById(e.data)
        
        if(el) {
            el.scrollIntoView()
        }
    })
})
