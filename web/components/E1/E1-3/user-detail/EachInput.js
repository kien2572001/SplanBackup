export default function EachInput({title, id, content, detail}) {
    return(
        <>
            <div className="grid grid-cols-9 auto-rows-auto items-center gap-y-0">
                <label htmlFor={id} className="col-span-9 text-left sm:col-span-3 sm:text-right text-lg font-bold">
                    {title}
                    {!detail && <span className="text-red-400 mx-1">*</span>}
                    :
                </label>
                <div className="col-span-9 sm:col-span-6 sm:pl-4 text-lg font-bold">
                    {content}
                </div>
            </div>
        </>
    )
}