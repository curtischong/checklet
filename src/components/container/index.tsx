export type ContainerProps = {
    children: React.ReactNode;
};

export const Container: React.FC<ContainerProps> = (props: ContainerProps) => {
    return <div className="min-h-screen flex flex-col">{props.children}</div>;
};
