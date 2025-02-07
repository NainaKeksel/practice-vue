let app = new Vue({
    el: '#app',
    data: {
        product: "Носки",
        description: "Пара теплых, пушистых носков",
        image: "./assets/vmSocks-blue-onWhite.jpg",
        altText: 'Socks',
        link: "https://www.ozon.ru/category/odezhda-obuv-i-aksessuary-7500/?text=%D0%BD%D0%BE%D1%81%D0%BA%D0%B8&clid=11468697-1",
        inStock: false,
        inventory: 0,
        onSale: true,
        details: ['80% хлопок', '20% полиэстер', 'Унисекс'],
        variants: [
            {
                variantId: 2234,
                variantColor: 'green',
                variantImage: "./assets/vmSocks-green-onWhite.jpg",
            },
            {
                variantId: 2235,
                variantColor: 'blue',
                variantImage: "./assets/vmSocks-blue-onWhite.jpg",
            }
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        cart: 0,
    },
    methods: {
        addToCart() {
            this.cart += 1
        },
        removeFromCart(index) {
            this.cart -= 1
        },
        updateProduct(variantImage) {
            this.image = variantImage
        }
    }
})


