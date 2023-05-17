(() => {
    var inputElm = document.querySelector('input[name=tags-regular]')
    
    const mockAjax = (timeout => (RES, duration) => {
      clearTimeout(timeout); // abort last request
      return new Promise((resolve, reject) => timeout = setTimeout(resolve, duration || 0, RES))
    })()
    
    let tagify = new Tagify(inputElm, {
        whitelist: ['abb', 'cbb', 'bb', 'bb1', 'aaabb', 'bbb', 'aa', 'bba'],
        // whitelist: ["a", "ac", "aab", "aaa", "b", "bb", "ccc"],
        id: 'test1',
        tagTextProp: 'name',
        editTags: {
            clicks: 2,
        },
        transformTag: (tagData, originalData) => {
            tagData.title = tagData.value
        },
        // maxTags: 1,
        keepInvalidTags: true,
        // enforceWhitelist: true,
        dropdown: {
            enabled: 0,
            sortby: 'startsWith',
            // caseSensitive: true,
            // sortby(suggestions, query){
            //     console.log(suggestions, query)
            //     return suggestions;
            // }
        },
        templates: {
            dropdownItemNoMatch: function(data) {
                return `<div class='${this.settings.classNames.dropdownItem}' value="noMatch" tabindex="0" role="option">
                    No suggestion found for: <strong>${data.value}</strong>
                </div>`
            }
        }
    })
    
    // tagify.on('edit:start', ({detail}) => tagify.setTagTextNode(detail.tag, detail.data.value))
    tagify.on('edit:updated', ({detail: {tagify}}) => {
        tagify.DOM.input.focus()
    });
    
    inputElm && inputElm.addEventListener('change', () => console.log("CHANGED!")  )
    
    setTimeout(() => {
        tagify.loadOriginalValues(["ac", {value: "aab", editable:false}, "aaa", "b", "bb", "ccc"])
    }, 500);
    
    
    })()

    (() => {
    var inputElm = document.querySelector('input[name=tags-disabled-user-input]')
    
    new Tagify(inputElm, {
        whitelist: [1,2,3,4,5],
        //userInput: false
    })
    })()

    (() => {
        var emptyJSONTagify = new Tagify(document.querySelector('input[name=value_empty_JSON]'), {
            addTagOnBlur: false,
            autoComplete : {
                rightKey:true
            },
            dropdown: {
                enabled: 0,
                mapValueTo: "email",
                searchKeys: ['value', 'email']
            },
            whitelist: [
                {
                    value: 'Chris Muller',
                    email: 'chris.muller@gmail.com',
                },
                {
                    value: 'Alon Silko',
                    email: 'alon@gmail.com',
                },
                {
                    value: 'aaa',
                    email: '1111alon@gmail.com',
                },
                {
                    value: 'aaaaa1',
                    email: '11aaa@gmail.com',
                },
            ]
        })
    
        var tagify3 = new Tagify(document.querySelector('input[name=value_JSON]'), {
        //  delimiters: ",|[\\n\\r]",
            pasteAsTags: false,
            addTagOnBlur: false,
            a11y: {
                focusableTags: true
            },
            dropdown: {
                enabled: 0
            },
            whitelist: [{value:"x,y,z", id:123}]
        })
    
        // should allow adding multiple tags as 1 string with new lines
        // tagify3.addTags(
        //   `a,b
        //   c
        //   d`
        // )
    
    
        var input = document.querySelector('input[name=tags]');
        var whitelist = ['aaabc', 'aaacb', 'aaabb', 'bbbbc', 'cccbd', 'dddbe', 'eeec', 'fffcc'];
    
        // init Tagify script on the above inputs
        var tagify = new Tagify(input, {
            pattern: /^[0-9A-Za-z_✲ "]+$/,
            editTags : 1,
            maxTags: 3,
            duplicates: false,
            keepInvalidTags: true,
            // dropdown: {
            //     enabled: 0
            // },
            // after 2 characters typed, all matching values from this list will be suggested in a dropdown
            whitelist: [].concat(whitelist),
            hooks: {
                beforePaste: function(content){
                    return new Promise((resolve, reject) => {
                        confirm("Allow pasting?")
                            ? resolve()
                            : reject()
                    })
            }
            }
        })
    
        tagify.addTags( `a,a` )
    
        // Chainable event listeners
        tagify.on('add', onAddTag)
            .on('remove', onRemoveTag)
            .on('input', onInput)
            //.on('keydown', onKeyDown)
            .on('edit:beforeUpdate', onPreUpdate)
            .on('edit:start edit:keydown click', saveCaretPos)
            .on('edit:input edit:updated edit:start', e => console.log(e.type, e))
            .on('invalid', onInvalidTag)
            .on('click', onTagClick)
            .on('focus', onTagifyFocusBlur)
            .on('blur', onTagifyFocusBlur)
            .on('dropdown:show', onDropdownShow)
            .on('dropdown:hide', onDropdownHide)
            .on('dropdown:select', onDropdownSelect)
    
        var mockAjax = (function mockAjax(){
            var timeout;
            return function(duration){
                clearTimeout(timeout); // abort last request
                return new Promise(function(resolve, reject){
                    timeout = setTimeout(resolve, duration || 1000, whitelist)
                })
            }
        })()
    
        function saveCaretPos(e){
            // a delay is needed because the caret does not change location yet when `keydown` event is fired
            setTimeout(function(sel){
                cachedSelection = {
                anchorNode   : sel.anchorNode,
                anchorOffset : sel.anchorOffset
                }
            }, 0, window.getSelection())
        }
    
        function onPreUpdate(e){
            //insertNodeAtSelection('😀', cachedSelection.anchorNode, cachedSelection.anchorOffset)
            console.log("onPreUpdate", cachedSelection)
        }
    
        // tag added callback
        function onAddTag(e){
            console.log("onAddTag: ", e.detail);
            console.log("original input value: ", input.value)
            tagify.off('add', onAddTag) // exmaple of removing a custom Tagify event
        }
    
        // tag remvoed callback
        function onRemoveTag(e){
            console.log("Tag removed:", e.detail);
            console.log("tagify instance value:", tagify.value, tagify.getTagElms())
        }
    
        // on character(s) added/removed (user is typing/deleting)
        function onInput(e){
            console.log("onInput: ", e.detail)
    
            tagify.loading(true)
            tagify.whitelist = null
    
            // get new whitelist from some async request (mocked)
            mockAjax()
                .then(function(result){
                    tagify.loading(false)
                    tagify.whitelist = result
                    // render the suggestions dropdown
                    tagify.dropdown.show(e.detail.value)
                })
        }
    
        // invalid tag added callback
        function onInvalidTag(e){
            console.log("onInvalidTag: ", e.detail);
        }
    
        // invalid tag added callback
        function onTagClick(e){
            console.log(e.detail);
            console.log("onTagClick: ", e.detail);
        }
    
        function onTagifyFocusBlur(e){
            console.log(e.type, "event fired")
        }
    
        function onDropdownShow(e){
            console.log("onDropdownShow: ", e.detail)
        }
    
        function onDropdownHide(e){
            console.log("onDropdownHide: ", e.detail)
        }
    
        function onDropdownSelect(e){
            console.log("onDropdownSelect: ", e.detail)
        }
    })()
