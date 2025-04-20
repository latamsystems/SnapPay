import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { formatDistanceToNowStrict } from 'date-fns';
import { es } from 'date-fns/locale';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  // Variables
  nameDaysAb: string[] = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  nameDays: string[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  nameMontsAb: string[] = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  nameMonts: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  // visualizacion de calendario
  private readonly dialogState = new BehaviorSubject<boolean>(false);
  public dialogState$ = this.dialogState.asObservable();

  constructor() { }

  //===================================================================
  // Transformaciones de fecha
  //===================================================================

  // Mostrar calendario
  public showDialog() {
    this.dialogState.next(true);
  }

  // Ocultar calendario
  public hideDialog() {
    this.dialogState.next(false);
  }

  // Obtener solo el mes
  getMonthFromDate(date: Date | string): string {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    const monthIndex = parsedDate.getMonth(); // getMonth() devuelve un índice basado en 0
    return this.nameMonts[monthIndex]; // Devuelve el nombre completo del mes en español
  }

  //===================================================================
  // Transformaciones de fecha
  //===================================================================

  // Obtener edad de la persona
  calculateAge(birth: Date | string): number {
    const birthDate = typeof birth === 'string' ? new Date(birth) : birth;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  // Obtener edad de la persona en años, meses y días
  calculateAgeComplete(birth: Date | string): { years: number, months: number, days: number } {
    const birthDate = typeof birth === 'string' ? new Date(birth) : birth;
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += previousMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  }


  // Transformar fecha en formato de string
  formatearFechaString(date: string, month?: number) {
    const partesFecha = date.split('-'); // Dividir la fecha en partes [año, mes, día]

    const año = partesFecha[0];
    const mes = this.nameMonts[parseInt(partesFecha[1], 10) - 1];
    const día = parseInt(partesFecha[2], 10);

    let mes_fin;
    if (month) {
      mes_fin = mes + month;
    } else {
      mes_fin = mes;
    }

    return `${día} de ${mes_fin} del ${año}`;
  }

  // transformar fecha con formato de Date
  formatearFechaDate(date: Date, month?: number) {

    let new_date;

    if (month) {
      new_date = new Date(date.setMonth(month));
    } else {
      new_date = date;
    }

    const año = new_date.getFullYear();
    const mes = this.nameMonts[new_date.getMonth()];
    const día = new_date.getDate();

    return `${día} de ${mes} del ${año}`;
  }

  // Formatea una fecha como "MMM YYYY"
  formatMonthYear(date: Date): string {
    const months = this.nameMontsAb.map(month => month.toUpperCase());
    const month = months[date.getMonth()];
    const year = date.getFullYear().toString().slice(-2);
    return `${month} ${year}`;
  }

  // Formatear fecha y hora a region bogota
  formatDateToBogota(date: Date): string {
    // Ajustar la fecha a la zona horaria de Bogotá (UTC-5)
    const bogotaOffset = -5 * 60; // Offset en minutos
    const localTime = date.getTime();
    const localOffset = date.getTimezoneOffset() * 60000;
    const utc = localTime + localOffset;
    const bogotaTime = utc + (bogotaOffset * 60000);
    const bogotaDate = new Date(bogotaTime);

    // Formatear la fecha a una cadena en el formato 'yyyy-MM-ddTHH:mm:ss'
    const year = bogotaDate.getFullYear();
    const month = String(bogotaDate.getMonth() + 1).padStart(2, '0');
    const day = String(bogotaDate.getDate()).padStart(2, '0');
    const hours = String(bogotaDate.getHours()).padStart(2, '0');
    const minutes = String(bogotaDate.getMinutes()).padStart(2, '0');
    const seconds = String(bogotaDate.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  // Formatear el tiempo restante
  formatRelativeDate(date: string): string {
    return formatDistanceToNowStrict(new Date(date), {
      locale: {
        ...es,
        formatDistance: (token, count, options) => {
          const formatDistanceLocale = {
            lessThanXSeconds: 'hace menos de {{count}} segundos',
            xSeconds: 'hace {{count}} segundos',
            halfAMinute: 'hace medio minuto',
            lessThanXMinutes: 'hace menos de {{count}} minutos',
            xMinutes: 'hace {{count}} minutos',
            aboutXHours: 'hace aproximadamente {{count}} horas',
            xHours: 'hace {{count}} horas',
            xDays: 'hace {{count}} días',
            aboutXWeeks: 'hace aproximadamente {{count}} semanas',
            xWeeks: 'hace {{count}} semanas',
            aboutXMonths: 'hace aproximadamente {{count}} meses',
            xMonths: 'hace {{count}} meses',
            aboutXYears: 'hace aproximadamente {{count}} años',
            xYears: 'hace {{count}} años',
            overXYears: 'hace más de {{count}} años',
            almostXYears: 'hace casi {{count}} años'
          };

          let result = formatDistanceLocale[token];

          if (typeof count === 'number') {
            result = result.replace('{{count}}', count.toString());

            // Manejar el singular y plural
            if (token === 'xHours' && count === 1) {
              result = result.replace('horas', 'hora');
            }
            if (token === 'xDays' && count === 1) {
              result = result.replace('días', 'día');
            }
            if (token === 'xWeeks' && count === 1) {
              result = result.replace('semanas', 'semana');
            }
            if (token === 'xMonths' && count === 1) {
              result = result.replace('meses', 'mes');
            }
            if (token === 'xYears' && count === 1) {
              result = result.replace('años', 'año');
            }
          }

          return result;
        }
      }
    });
  }

}
