import { prisma } from "@/lib/prisma";
import { ListingCard } from "@/components/listings/ListingCard";
import { SearchFilters } from "@/components/filters/SearchFilters";
import { Search, Sparkles } from "lucide-react";

interface SearchParams {
  q?: string;
  category?: string;
  city?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  sort?: string;
}


async function searchListings(params: SearchParams) {

  const where:any = {
    status:"ACTIVE",
  };


  if(params.q){

    where.OR = [
      {
        title:{
          contains:params.q,
          mode:"insensitive",
        },
      },
      {
        description:{
          contains:params.q,
          mode:"insensitive",
        },
      },
    ];

  }



  if(params.category)
    where.category=params.category;



  if(params.city){

    where.city={
      contains:params.city,
      mode:"insensitive",
    };

  }



  if(params.minPrice || params.maxPrice){

    where.price={};


    if(params.minPrice)
      where.price.gte =
        Number(params.minPrice);


    if(params.maxPrice)
      where.price.lte =
        Number(params.maxPrice);

  }



  if(params.minRating){

    where.avgRating={
      gte:Number(params.minRating),
    };

  }



  return prisma.listing.findMany({

    where,

    include:{
      user:{
        select:{
          name:true,
          image:true,
        },
      },
    },


    orderBy:{
      createdAt:"desc",
    },


    take:50,

  });

}





export default async function SearchPage({

searchParams,

}:{
searchParams:Promise<SearchParams>
}){


const params = await searchParams;

const listings =
await searchListings(params);



return (

<main className="
min-h-screen
px-6
py-24
">



<div className="
max-w-7xl
mx-auto
">






{/* HEADER */}


<section className="
text-center
mb-14
">


<div className="
inline-flex
items-center
gap-2
text-green-600
mb-5
">

<Sparkles size={18}/>

Smart discovery

</div>



<h1 className="
text-5xl
font-semibold
tracking-tight
">

Find the right person.

</h1>



<p className="
mt-4
text-neutral-500
text-lg
">

Trusted help from your local community.

</p>


</section>








{/* SEARCH CONTROLS */}


<div className="
mb-12
">

<SearchFilters
currentParams={params}
/>


</div>








{/* RESULTS */}



<div className="
flex
items-center
justify-between
mb-8
">


<div>

<h2 className="
text-3xl
font-semibold
">

Results

</h2>


<p className="
text-neutral-500
mt-1
">

{listings.length} people available

</p>


</div>



<div className="
flex
items-center
gap-2
text-neutral-400
">

<Search size={18}/>

</div>


</div>









{listings.length === 0 ? (


<div className="
rounded-[40px]
p-20
text-center
bg-neutral-100
dark:bg-neutral-900
">


<div className="
text-5xl
mb-5
">

🔍

</div>


<h3 className="
text-2xl
font-semibold
">

Nothing found

</h3>


<p className="
mt-3
text-neutral-500
">

Try adjusting your search.

</p>


</div>



):(


<div className="
grid
md:grid-cols-2
xl:grid-cols-3
gap-8
">


{listings.map((listing)=>(


<ListingCard
key={listing.id}
listing={listing as any}
/>


))}


</div>


)}




</div>


</main>

);


}