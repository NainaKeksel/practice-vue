Vue.component('product', {
    template: `
       <div class="product">
            <div class="product-image">
                <img v-bind:alt="altText" v-bind:src="image">
            </div>
            <div class="product-info">
                <h1>{{ title }}</h1>
                <p>{{description}}</p>
                <span >{{ sale }}</span>
                <p v-if="inStock" >В наличии</p>
                <p v-else :class="{ OutOfStock:!inStock }">Нет в наличии</p>
                <p>Доставка: {{ shipping }}</p>
                
                <div class="color-box" v-for="(variant, index) in variants" :key="variant.variantId"
                     @mouseover="updateProduct(index)" :style="{ backgroundColor:variant.variantColor }">
                </div>
                <select>
                    <option v-for="size in sizes">{{size}}</option>
                </select>
                <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Добавить в корзину</button>
                <button v-on:click="removeFromCart">Удалить из корзины</button>
                <br>
                <a v-bind:href="link">Похожее</a>
            </div>
            <p>Премиум-аккаунт: {{ premium }}</p>
            <div class="cart">
                <p>Корзина({{ cart }})</p>
            </div>
       </div>`,
    data() {
        return {
            product: "Носки",
            brand: 'Vue Mastery',
            description: "Пара теплых, пушистых носков",
            selectedVariant: 0,
            altText: 'Socks',
            link: "https://www.ozon.ru/category/odezhda-obuv-i-aksessuary-7500/?text=%D0%BD%D0%BE%D1%81%D0%BA%D0%B8&clid=11468697-1",
            onSale: [
                {
                    not: "Нет распродажи",
                    yes: "Распродажа"
                }
            ],
            // details: ['80% хлопок', '20% полиэстер', 'Унисекс'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                },
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            cart: 0,
        }
    },
    props: {
        premium: {
            type: Boolean,
            required: false
        }
    },
    methods: {
        addToCart() {
            this.cart += 1
        },
        removeFromCart(index) {
            this.cart -= 1
        },
        updateProduct(index) {
            this.selectedVariant = index;
        },
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale(){
            return this.onSale.not  + ' ' + this.brand + ' ' + this.product;
        },
        shipping() {
            if (this.premium) {
                return "Бесплатно";
            } else {
                return "50₽"
            }
        }
    },
})

Vue.component('product-details', {
    template: `
    <ul>
        <li v-for="detail in details">{{ detail }}</li>
    </ul>`,
    data() {
        return {
            details: ['80% хлопок', '20% полиэстер', 'Унисекс'],
    }}

})
    let app = new Vue({
    el: '#app',
    data: {
        premium: false
    }
})


