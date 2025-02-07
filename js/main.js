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
            <div>
            <h2>Reviews</h2>
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
              <li v-for="review in reviews">
              <p>{{ review.name }}</p>
              <p>Rating: {{ review.rating }}</p>
              <p>{{ review.review }}</p>
              </li>
            </ul>
           </div> <product-review @review-submitted="addReview"></product-review>
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
            cart: [],
            reviews: []
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
            this.$emit('remove-from-cart',
                this.variants[this.selectedVariant].variantId);
        },
        removeFromCart(index) {
            this.$emit('remove-from-cart',
            this.variants[this.selectedVariant].variantId);

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
Vue.component('product-review', {
    template: `
       <form class="review-form" @submit.prevent="onSubmit">
       <p v-if="errors.length">
             <b>Please correct the following error(s):</b>
             <ul>
               <li v-for="error in errors">{{ error }}</li>
             </ul>
       </p>
         <p>
           <label for="name">Имя:</label>
           <input id="name" v-model="name" placeholder="name">
         </p>
        
         <p>
           <label for="review"Отзыв:</label>
           <textarea id="review" v-model="review"></textarea>
         </p>
         <p>
           <label for="rating">Рейтинг:</label>
           <select id="rating" v-model.number="rating">
             <option>5</option>
             <option>4</option>
             <option>3</option>
             <option>2</option>
             <option>1</option>
           </select>
         </p>
         <p>
           <label class="rec">Смогли бы вы порекоментовать этот товар?</label>
           <input type="radio" id="rec" name="drone" value="Да" v-model="recommended">
           <label for="rec">Yes</label>
           <input type="radio" id="not_rec" name="drone" value="Нет" v-model="recommended">
           <label for="not_rec">Yesn't</label>
         </p>
         <p>
           <input type="submit" value="Submit"> 
         </p>
    
        </form>
        
        
 `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: [],
            recommended: null,
        }
    },
    methods:{
        onSubmit() {
            if(this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                this.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
            }
        },
    }
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
        premium: false,
        cart: []
    },
    methods: {
        addReview(productReview) {
            this.reviews.push(productReview)
        },
        updateCart(id) {
            this.cart.push(id);
        },
        eraseCart(id) {
            this.cart.pop(id);
        }
    },
})


