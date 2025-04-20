import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SocketService } from '../services/socket.service';

@Injectable({
    providedIn: 'root'
})
export class SocketShared {

    private readonly eventSubjects: Map<string, Subject<any>> = new Map();
    private readonly persistentEvents: Set<string> = new Set();

    constructor(private readonly socketService: SocketService) { }

    /**
     * Escuchar eventos del servidor socket
     * @param event nombre del evento
     * @param persistent true si deseas mantener el evento vivo aún después de destruir el componente
     */
    listenTo<T = any>(event: string, persistent: boolean = false): Observable<T> {
        if (!this.eventSubjects.has(event)) {
            const subject = new Subject<T>();
            this.eventSubjects.set(event, subject);

            if (persistent) {
                this.persistentEvents.add(event);
            }

            this.socketService.socket.on(event, (data: T) => {
                subject.next(data);
            });
        }

        const base$ = this.eventSubjects.get(event)!.asObservable();

        // Si no es persistente, limpiar automáticamente cuando la suscripción termina (componente destruido)
        if (!persistent) {
            return new Observable<T>(observer => {
                const subscription = base$.subscribe(observer);
                return () => {
                    subscription.unsubscribe();
                    this.clearEvent(event); // ← limpieza automática
                };
            });
        }

        return base$;
    }

    /**
    * Escuchar múltiples eventos para una entidad
    * @param entity nombre de la entidad (ej: 'period')
    * @param actions array de acciones (ej: ['created', 'updated'])
    * @param persistent si deseas mantener los eventos activos después del destroy del componente
    */
    listenToMany<T = any>(
        entity: string,
        actions: Array<'created' | 'updated' | 'deleted' | 'enabled' | string>,
        persistent: boolean = false
    ): Observable<{ event: string, data: T }> {
        return new Observable(observer => {
            const subscriptions: Array<() => void> = [];

            actions.forEach(action => {
                const eventName = `${entity}:${action}`;

                // Si no existe aún el subject, crearlo y registrar en el socket
                if (!this.eventSubjects.has(eventName)) {
                    const subject = new Subject<T>();
                    this.eventSubjects.set(eventName, subject);

                    if (persistent) {
                        this.persistentEvents.add(eventName);
                    }

                    this.socketService.socket.on(eventName, (data: T) => {
                        subject.next(data);
                    });
                }

                // Subscribirse al subject y enviar evento + datos
                const base$ = this.eventSubjects.get(eventName)!.asObservable().subscribe(data => {
                    observer.next({ event: eventName, data });
                });

                // Guardar función para limpiar
                subscriptions.push(() => {
                    base$.unsubscribe();
                    if (!persistent) this.clearEvent(eventName);
                });
            });

            // Cuando el observable se destruya → limpiar todos los eventos suscritos
            return () => {
                subscriptions.forEach(clean => clean());
            };
        });
    }


    /**
     * Limpiar un evento específico
     */
    private clearEvent(event: string) {
        if (this.eventSubjects.has(event) && !this.persistentEvents.has(event)) {
            this.eventSubjects.get(event)?.complete();
            this.eventSubjects.delete(event);
            this.socketService.socket.off(event);
        }
    }
}
