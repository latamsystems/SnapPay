import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment.development';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public socket!: Socket;
  private reconnectionAttempts: number = 0;
  private readonly maxReconnectionAttempts: number = 3; // Número máximo de intentos de reconexión
  private readonly reconnectionDelay: number = 3000; // Tiempo de espera entre intentos de reconexión (ms)

  constructor(private readonly authService: AuthService) {
    this.initializeWebSocketConnection();
  }

  private initializeWebSocketConnection(): void {
    console.log('Inicializando conexión WebSocket...');
    this.socket = io(environment.socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: false // Desactivar la reconexión automática del socket.io
    });

    // Maneja la conexión
    this.socket.on('connect', () => {
      console.log('Conectado al servidor WebSocket');
      this.reconnectionAttempts = 0; // Reinicia el contador de intentos de reconexión

      // Enviar el ID del usuario al servidor
      const user = this.authService.getuser();
      if (user) {
        this.socket.emit('user_connected', user.id_user, user.firstname_user, user.lastname_user);
      }
    });

    // Maneja la desconexión del servidor
    this.socket.on('disconnect', () => {
      console.log('Conexión cerrada');
      this.handleReconnection();
    });

    // Maneja errores
    this.socket.on('error', (error: any) => {
      console.error('Error en la conexión:', error);
      this.handleReconnection();
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('Error en la conexión:', error);
      this.handleReconnection();
    });
  }

  private handleReconnection(): void {
    if (this.reconnectionAttempts < this.maxReconnectionAttempts) {
      this.reconnectionAttempts++;
      console.log(`Intentando reconectar... (${this.reconnectionAttempts}/${this.maxReconnectionAttempts})`);
      setTimeout(() => {
        this.initializeWebSocketConnection();
      }, this.reconnectionDelay);
    } else {
      console.error('Número máximo de intentos de reconexión alcanzado. No se pudo conectar al servidor WebSocket.');
    }
  }

  // Método para enviar mensajes al servidor
  sendMessage(message: string): void {
    this.socket.emit('message', message);
  }
}
