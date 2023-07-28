import $ from 'jquery'

$(document).ready(() => {
    $(document).on('click', '.select', event => {
        $(document).find('.select').removeClass('show')
        $(document).find('.select ul').fadeOut({ duration: 300, easing: 'linear' })

        const target = $(event.currentTarget)
        const ul = target.children('ul')

        if(ul.css('display') === 'block') {
            target.removeClass('show')
            ul.fadeOut({ duration: 300, easing: 'linear' })
        }
        else {
            const
                windowWidth = $(window).width(),
                windowHeight = $(window).height(),

                targetPosition = target.offset()

            if(targetPosition.top > windowHeight / 2) {
                target.removeClass('ulbottom')
                target.addClass('ultop')
            }
            else {
                target.addClass('ulbottom')
                target.removeClass('ultop')
            }

            if(targetPosition.left > windowWidth / 2) {
                target.removeClass('ulleft')
                target.addClass('ulright')
            }
            else {
                target.addClass('ulleft')
                target.removeClass('ulright')
            }

            target.addClass('show')
            ul.fadeIn({ duration: 300, easing: 'linear' })
        }
    })
})