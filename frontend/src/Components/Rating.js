import React from 'react'
import { BsStarFill, BsStarHalf } from 'react-icons/bs'
import { BiStar } from 'react-icons/bi'

const Rating = ({stars,numReviews }) => {
    return (
        <div className='rating'>
            <span className='star_yellow'>
                {stars >= 1 ? <BsStarFill /> : stars >= 0.5 ? <BsStarHalf /> : <BiStar />}
            </span>
            <span className='star_yellow'>
                {stars >= 2 ? <BsStarFill /> : stars >= 1.5 ? <BsStarHalf /> : <BiStar />}
            </span>
            <span className='star_yellow'>
                {stars >= 3 ? <BsStarFill /> : stars >= 2.5 ? <BsStarHalf /> : <BiStar />}
            </span>
            <span className='star_yellow'>
                {stars >= 4 ? <BsStarFill /> : stars >= 3.5 ? <BsStarHalf /> : <BiStar />}
            </span>
            <span className='star_yellow'>
                {stars >= 5 ? <BsStarFill /> : stars >= 4.5 ? <BsStarHalf /> : <BiStar />}
            </span>
        </div>
    )
}

export default Rating
