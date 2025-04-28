type EventName = "flashSidebarButton";

type Listener = () => void;

const listeners: Record<EventName, Listener[]> = {
  flashSidebarButton: [],
};

export const EventBus = {
  on(event: EventName, listener: Listener) {
    listeners[event].push(listener);
  },
  off(event: EventName, listener: Listener) {
    listeners[event] = listeners[event].filter((l) => l !== listener);
  },
  emit(event: EventName) {
    listeners[event].forEach((listener) => listener());
  },
};