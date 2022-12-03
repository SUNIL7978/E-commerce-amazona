import React from 'react'
import { BsStarFill, BsStarHalf } from 'react-icons/bs'
import { BiStar } from 'react-icons/bi'

const Rating = ({ stars, numReviews, caption }) => {
    return (
        <div className='rating d-flex gap-1'>
            <span>
                {stars >= 1 ? <BsStarFill /> : stars >= 0.5 ? <BsStarHalf /> : <BiStar />}
            </span>
            <span>
                {stars >= 2 ? <BsStarFill /> : stars >= 1.5 ? <BsStarHalf /> : <BiStar />}
            </span>
            <span>
                {stars >= 3 ? <BsStarFill /> : stars >= 2.5 ? <BsStarHalf /> : <BiStar />}
            </span>
            <span >
                {stars >= 4 ? <BsStarFill /> : stars >= 3.5 ? <BsStarHalf /> : <BiStar />}
            </span>
            <span>
                {stars >= 5 ? <BsStarFill /> : stars >= 4.5 ? <BsStarHalf /> : <BiStar />}
            </span>
            {caption ? (
                <span>{caption}</span>
            ) : (
                <span>{' ' + numReviews + ' reviews'}</span>
            )}
        </div>
    )
}

export default Rating
