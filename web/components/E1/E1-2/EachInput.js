export default function EachInput({title, id, content, errorMessage, detail}) {
    return(
        <>
            <div className="grid grid-cols-9 auto-rows-auto items-center">
                <label htmlFor={id} className="col-span-9 lg:col-span-3 text-lg font-bold lg:text-right">
                    {title}
                    {!detail && <span className="text-red-400 mx-1">*</span>}
                    :
                </label>
                <div className="col-span-9 lg:col-span-6 lg:pl-4 text-lg font-bold">
                    {content}
                </div>
                {errorMessage && 
                    <span className="col-span-9 lg:col-span-6 lg:row-start-2
                    lg:col-start-4 lg:pl-4 text-red-500 text-base font-normal block mt-1">
                        {errorMessage}
                    </span>
                }
            </div>
        </>
    )
}