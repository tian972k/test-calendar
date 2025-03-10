import React from "react";

// HOC to wrap a component with a WarpProvider (in this case, DetailCourseProvider)
function withWarpProvider<P extends object>(
  Component: React.ComponentType<P>,
  WarpProvider: React.ComponentType<P & { children: React.ReactNode }>,
): React.FC<P> {
  const WrappedComponent: React.FC<P> = (props) => {
    // Wrap the component with the provider, passing all props to WarpProvider
    return (
      <WarpProvider {...props}>
        <Component {...props} />
      </WarpProvider>
    );
  };

  WrappedComponent.displayName = `withWarpProvider(${
    Component.displayName || Component.name || "Component"
  })`;

  return WrappedComponent;
}

export default withWarpProvider;
