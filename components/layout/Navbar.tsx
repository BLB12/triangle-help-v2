"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

import {
  Menu,
  X,
  Search,
  MessageSquare,
  Plus,
  Shield,
  Settings,
} from "lucide-react";


export function Navbar() {

  const { data: session } = useSession();
  const [open,setOpen] = useState(false);

  const isAdmin =
    (session?.user as any)?.role === "ADMIN";


  return (

    <header className="
      fixed
      top-0
      left-0
      right-0
      z-50
      px-5
      pt-5
    ">


      <nav className="
        max-w-6xl
        mx-auto
        rounded-full
        border
        border-black/5
        dark:border-white/10
        bg-white/70
        dark:bg-black/50
        backdrop-blur-2xl
        shadow-[0_10px_40px_rgba(0,0,0,.08)]
      ">


        <div className="
          h-16
          px-6
          flex
          items-center
          justify-between
        ">



          {/* LOGO */}

          <Link
            href="/"
            className="
              flex
              items-center
              gap-3
            "
          >

            <div className="
              w-9
              h-9
              rounded-2xl
              bg-green-600
              flex
              items-center
              justify-center
              text-white
              font-semibold
            ">

              TH

            </div>



            <span className="
              font-semibold
              tracking-tight
            ">

              Triangle Help

            </span>


          </Link>






          {/* CENTER SEARCH */}

          <Link
            href="/search"
            className="
              hidden
              md:flex
              items-center
              gap-3
              px-5
              py-2.5
              rounded-full
              bg-neutral-100
              dark:bg-neutral-900
              text-neutral-500
              hover:bg-neutral-200
              dark:hover:bg-neutral-800
              transition
            "
          >

            <Search size={16}/>


            <span className="
              text-sm
            ">

              Ask for help...

            </span>


            <kbd className="
              hidden
              lg:block
              px-2
              py-1
              rounded-md
              bg-white
              dark:bg-black
              text-xs
            ">

              ⌘ K

            </kbd>


          </Link>







          {/* ACTIONS */}

          <div className="
            hidden
            md:flex
            items-center
            gap-2
          ">


          {session ? (

            <>


            {isAdmin && (

              <Link
                href="/admin"
                className="
                  text-orange-500
                  p-2
                "
              >

                <Shield size={18}/>

              </Link>

            )}



            <Link
              href="/messages"
              className="
                p-2.5
                rounded-full
                hover:bg-neutral-100
                dark:hover:bg-neutral-900
              "
            >

              <MessageSquare size={19}/>

            </Link>




            <Link
              href="/account"
              className="
                p-2.5
                rounded-full
                hover:bg-neutral-100
                dark:hover:bg-neutral-900
              "
            >

              <Settings size={19}/>

            </Link>




            <Link
              href="/listings/new"
              className="
                flex
                items-center
                gap-2
                px-5
                py-2.5
                rounded-full
                bg-green-600
                text-white
                text-sm
                font-medium
                hover:bg-green-500
                transition
              "
            >

              <Plus size={16}/>

              Create

            </Link>



            </>


          ) : (

            <>


              <Link
                href="/login"
                className="
                  text-sm
                  px-4
                  py-2
                "
              >

                Sign in

              </Link>



              <Link
                href="/listings/new"
                className="
                  px-5
                  py-2.5
                  rounded-full
                  bg-green-600
                  text-white
                  text-sm
                  font-medium
                "
              >

                Get started

              </Link>


            </>


          )}


          </div>







          {/* MOBILE */}

          <button
            onClick={()=>setOpen(!open)}
            className="
              md:hidden
              p-2
            "
          >

            {open ? <X/> : <Menu/>}


          </button>



        </div>



      </nav>


    </header>

  );

}