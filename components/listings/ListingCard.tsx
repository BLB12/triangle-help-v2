import Link from "next/link";
import { Star, MapPin, Verified } from "lucide-react";

import {
  formatPrice,
  formatCategory,
} from "@/lib/utils";


interface Listing {

  id:string;
  title:string;
  description:string;
  category:string;
  price:number;
  priceType:string;
  city:string;
  image?:string|null;
  avgRating?:number|null;
  reviewCount:number;

  user:{
    name?:string|null;
    image?:string|null;
  };

}



export function ListingCard({
  listing,
}:{
  listing:Listing;
}) {


return (

<Link
href={`/listings/${listing.id}`}
className="
group
block
"
>


<div className="
relative
overflow-hidden
rounded-[32px]
bg-white
dark:bg-neutral-900
border
border-black/5
dark:border-white/10
transition
duration-500
hover:-translate-y-2
hover:shadow-[0_30px_80px_rgba(0,0,0,.12)]
">





{/* IMAGE */}

<div className="
h-72
relative
overflow-hidden
bg-neutral-100
dark:bg-neutral-800
">


{listing.image ? (

<img
src={listing.image}
alt={listing.title}
className="
w-full
h-full
object-cover
transition
duration-700
group-hover:scale-110
"
/>

):(


<div className="
h-full
flex
items-center
justify-center
text-6xl
">

✨

</div>


)}



<div className="
absolute
top-5
left-5
">

<span className="
px-4
py-2
rounded-full
bg-white/80
dark:bg-black/60
backdrop-blur-xl
text-xs
font-medium
">

{formatCategory(listing.category)}

</span>


</div>



</div>






{/* CONTENT */}

<div className="
p-7
">



<div className="
flex
justify-between
gap-5
">


<h3 className="
text-xl
font-semibold
tracking-tight
group-hover:text-green-600
transition
">

{listing.title}

</h3>




<div className="
text-green-600
font-semibold
whitespace-nowrap
">

{formatPrice(
listing.price,
listing.priceType
)}

</div>



</div>





<p className="
mt-4
text-neutral-500
line-clamp-2
leading-relaxed
">

{listing.description}

</p>






<div className="
mt-6
flex
items-center
justify-between
">


<div className="
flex
items-center
gap-2
text-sm
text-neutral-500
">

<MapPin size={15}/>

{listing.city}

</div>





{listing.avgRating ? (

<div className="
flex
items-center
gap-1
text-sm
">

<Star
size={15}
className="
fill-yellow-400
text-yellow-400
"
/>

<span className="font-medium">

{listing.avgRating.toFixed(1)}

</span>


<span className="text-neutral-400">

({listing.reviewCount})

</span>


</div>


):(


<div className="
text-sm
text-neutral-400
">

New

</div>


)}



</div>







<div className="
mt-7
pt-5
border-t
border-black/5
dark:border-white/10
flex
items-center
gap-3
">


<div className="
w-11
h-11
rounded-full
bg-green-500/10
text-green-600
flex
items-center
justify-center
font-semibold
">

{listing.user.name?.[0] ?? "?"}


</div>




<div>

<div className="
flex
items-center
gap-1
font-medium
">

{listing.user.name ?? "Local Helper"}


<Verified
size={15}
className="
text-green-600
"
/>


</div>


<p className="
text-xs
text-neutral-400
">

Verified community member

</p>


</div>


</div>





</div>



</div>


</Link>

);

}