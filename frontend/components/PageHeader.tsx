interface PageHeaderProps {
    heading: string;
    subtext: string;
}

export default function PageHeader({ heading, subtext }: PageHeaderProps) {
    return (
        <div className="">
            <h1 className="text-2xl font-bold"> {heading} </h1>
            <p className="mb-6 text-gray-600">
                {subtext}
            </p>
        </div>
    );
}
