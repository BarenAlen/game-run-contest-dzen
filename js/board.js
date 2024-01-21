import axios from 'axios';

const board = () => {

    const maxSuggestions = 5 

    const resultsContainer = document.querySelector('#results-container')
    const resultsActiveFilterContainer = document.querySelector('#results-active-filter-container')
    const resultsSearchSuggestions = document.querySelector('#results-search-suggestions')
    const searchInput = document.querySelector('#results-search')
    const searchSubmitBtn = document.querySelector('#results-search-submit')
    const resultEmpty = document.querySelector('#results-board__empty-text')
    const resultBoard = document.querySelector('.results-board')
    let prev = null
    let fromPositionIdx = 30
    let lastMaxScroll = 0
    const batchSize = 15

    const deepEqual = (first, second) => Object.keys({ ...first, ...second }).every(key => first[key] === second[key]); 
    const showEmpty = (b) => {
        b && resultBoard.classList.remove('scrollable')
        resultEmpty.hidden = !b
        resultEmpty.parentElement.children[1].hidden = b
    }

    const params = {
        tag: null,
        query: ''
    }

    const getChannels = (autocomplete, {hasQuery, fromPosition, batchSize} = {}) => {
        axios({
            method: 'get',
            url: 'https://dzen.ru/api/v1/game/event/channels',
            params: {
                tag: params.tag,
                query: hasQuery ? params.query : null,
                fromPosition,
                batchSize
            }
        })
        .then((response) => {
            // console.log(response.data)
            showEmpty(false)
            if (autocomplete) {
                let names = response.data.map((channel) => {
                    return channel.channelName
                })
                renderSuggestions(names)
            } else {
                if(response.data.length > 10){
                    resultBoard.classList.add('scrollable') 
                }
                if(resultEmpty.parentElement.children[1].lastChild.id === 'results-board__empty-text__copy'){
                    resultEmpty.parentElement.children[1].lastChild.remove()
                }
                if(!!fromPosition && response.data.length === 0){
                    resultBoard.classList.remove('scrollable')
                    return
                }
                if(hasQuery && response.data.length === 0){
                    fromPositionIdx = 0
                    cleanResultsContainer()
                    resultBoard.classList.remove('scrollable')
                    const copy = resultEmpty.cloneNode(true)
                    copy.id = 'results-board__empty-text__copy'
                    copy.children[0].textContent = 'По вашему запросу ничего не найдено'
                    copy.children[1].remove()
                    resultEmpty.parentElement.children[1].hidden = false
                    resultEmpty.parentElement.children[1].appendChild(copy)
                    copy.hidden = false
                    return
                }
                if(hasQuery && !fromPosition && response.data.length <= 10 ){
                    resultBoard.classList.remove('scrollable')
                }
                if(!hasQuery && response.data.length === 0){
                    fromPositionIdx = 0
                    showEmpty(true)
                    return
                }
                renderChannels(response.data, !!fromPosition)
                prev = response.data
            }
        })
        .catch((error) => {
            console.error(error)
            if(!prev){
                showEmpty(true)
            }
        })
    }

    const renderChannels = (channels, isContinue) => {
        let elArray = []
        const children = resultsContainer.children
        if(prev && children.length > 0 && deepEqual(channels, prev)) return
        // cleanResultsContainer()
        let i = 0
        channels.forEach((item) => {
            let el = ''
            let levelRu = tagNameRu(item.tag)
            
            if(!isContinue && i < children.length){
                // position
                children[i].children[0].textContent = item.position
                // level
                children[i].children[1].children[0].className = ''
                children[i].children[1].children[0].classList.add('level-label', `level-label--${item.tag.toLowerCase()}`)
                children[i].children[1].children[0].textContent = levelRu
                // link
                children[i].children[2].children[0].href = item.channelUrl
                children[i].children[2].children[0].textContent = item.channelName
                // views
                children[i].children[3].textContent = item.views
            } else {
                let tr = document.createElement('tr')

                let channelName = document.createElement('td')
                channelName.innerHTML = `<a href="${item.channelUrl}" target="_blank">${item.channelName}</a>`

                let channelPosition = document.createElement('td')
                channelPosition.innerHTML = item.position

                let channelViews = document.createElement('td')
                channelViews.innerHTML = item.views
                
                let channelLevel = document.createElement('td')
                let tag = document.createElement('button')
                tag.type = 'button'
                tag.classList.add('level-label', `level-label--${item.tag.toLowerCase()}`)
                tag.innerHTML = levelRu
                // tag.dataset.tag = item.tag
                tag.addEventListener('click', (e) => {
                    filter(item.tag)
                })
                channelLevel.appendChild(tag)

                tr.appendChild(channelPosition)
                tr.appendChild(channelLevel)
                tr.appendChild(channelName)
                tr.appendChild(channelViews)
                resultsContainer.appendChild(tr)
            }
            i++
        })
        fromPositionIdx = channels[channels.length-1].position
        while(!isContinue && i < children.length){
            children[i].remove()
            i++
        }
    }

    const cleanResultsContainer = () => {
        resultsContainer.innerHTML = ''
    }
    const cleanActiveFilterContainer = () => {
        resultsActiveFilterContainer.innerHTML = ''
    }

    const renderSuggestions = (namesArr) => {
        resultsSearchSuggestions.innerHTML = ''

        let elArr = namesArr.map((name, i) => {
            if (i < maxSuggestions) {
                let li = document.createElement('li')
                let btn = document.createElement('button')
    
                btn.type = 'button'
                btn.innerHTML = name
                btn.addEventListener('click', (e) => {
                    searchInput.value = name
                    params.query = name
                    cleanResultsContainer()
                    getChannels()
                    resultsSearchSuggestions.classList.remove('show')
                })
    
                li.appendChild(btn)
    
                resultsSearchSuggestions.appendChild(li)
            }
        })
    }

    const renderFilterBtn = (tag) => {
        let btn = document.createElement('button')

        btn.type = 'button'
        btn.classList.add('level-label', `level-label--${tag.toLowerCase()}`)
        btn.innerHTML = `${tagNameRu(tag)}<span></span>`
        btn.addEventListener('click', (e) => {
            filter(null)
        })

        resultsActiveFilterContainer.appendChild(btn)
    }

    const filter = (tag) => {
        if (tag != params.tag) {
            cleanResultsContainer()
            cleanActiveFilterContainer()
            params.tag = tag
            if (tag) {
                renderFilterBtn(tag)
            }
            getChannels()
        }
    }

    const tagNameRu = (tag) => {
        if (tag == 'LEGEND') {
            return 'Легенда'
        }
        if (tag == 'MASTER') {
            return 'Мастер'
        }
        if (tag == 'EXPERT') {
            return 'Эксперт'
        }
        if (tag == 'STUDENT') {
            return 'Ученик'
        }
        if (tag == 'NEWBIE') {
            return 'Новичок'
        }
    }

    const init = () => {
        axios({
            method: 'get',
            url: '/ajax.php?action=date_time',
        })
        .then(response => {
            if(new Date('2023-09-21T16:00:00') > new Date(response.data)){
                showEmpty(true)
            } else {
                const wrapper = resultsContainer.parentElement.parentElement
                wrapper.addEventListener('scroll', e => {
                    const scrollTopMax = wrapper.scrollTopMax || (wrapper.scrollHeight - wrapper.getBoundingClientRect().height)
                    if(lastMaxScroll !== scrollTopMax && e.target.scrollTop > scrollTopMax - 50){
                        const hasQuery = searchInput.value.length >= 2
                        if(hasQuery && fromPositionIdx === 0){
                            fromPositionIdx = 30
                        }
                        getChannels(false, {hasQuery, batchSize, fromPosition: fromPositionIdx})
                        fromPositionIdx += batchSize
                        lastMaxScroll = scrollTopMax
                    }
                    if(e.target.scrollTop > scrollTopMax - 10){
                        resultBoard.classList.remove('scrollable')
                    } else {
                        resultBoard.classList.add('scrollable')
                    }
                })
                getChannels()
            }
        })
        .catch((error) => {
            console.error(error)
            showEmpty(true)
        })
    }

    searchInput.addEventListener('keyup', (e) => {
        params.query = searchInput.value

        if (searchInput.value.length > 3) {
            getChannels(true)
            resultsSearchSuggestions.classList.add('show')
        } else {
            resultsSearchSuggestions.innerHTML = ''
            resultsSearchSuggestions.classList.remove('show')
        }
        resultsSearchSuggestions.classList.remove('show')
        fromPositionIdx = 0
        cleanResultsContainer()
        getChannels(false, {hasQuery: searchInput.value.length >= 2})
    })

    searchSubmitBtn.addEventListener('click', (e) => {
        cleanResultsContainer()
        getChannels()
    })

    init()
}

export default board

