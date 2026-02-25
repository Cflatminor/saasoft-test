import type {Account} from "@/src/core/types/account";

import Repository from "./repository/Repository";

interface iDependencies {
  repository: Repository
}

interface iAccountService {
  getAccounts: () => Promise<Account[]>;
  createAccount: (account: Account) => Promise<Account>;
  updateAccount: (account: Account) => Promise<Account>;
  deleteAccount: (id: string) => Promise<string>;
}

/**
 * Я решил использовать такой подход, как один из вариантов надёжной изоляции доменного слоя от
 * ui компонентов, сохраняя его универсальность, автономность для тестирования
 * и возможность ре-использования, т.к. имею с ним опыт. Подход описан в книгах Эрика
 * Эванса и Роберта Мартина и хорошо вписывается в ООП.
 *
 * Впрочем, это не "истина в последней инстанции", есть и другие возможные способы реализации.
 * Например, в nuxt есть механизм "composables", но нужно понимать, что он жёстко привязывает
 * реализацию ключевых слоёв к ui фреймворку, что является антипаттерном и сокращает срок годности
 * кодовой базы (есть много примеров, когда новая версия фреймворка не обратно-совместима, сигнатуры многих методов
 * поменялись, и приложение становится никому не нужным легаси. Бизнесу - проблема).
 *
 * Так же, нет никаких проблем просто вставить валидацию пропсов непосредственно в ui компоненты,
 * там же проверять типы получаемых и передаваемых данных механизмами TypeScript на этапе компиляции.
 * Но важно понимать, что это не является основной задачей этого архитектурного слоя, а служит
 * дополнительной подстраховкой.
 *
 * Хорошей практикой, которую я применял на крупных проектах, будет использование Entity - сущности
 * с геттерами и сеттерами. Entity оперируют как бизнес логика, так и UI, что бы не писать в каждом
 * месте, где используется та, или иная сущность код типа object.property.type.innerProperty.searchedValue,
 * мы просто пишем account.getPassword() - метод, который всегда возвращает нужный тип, независимо
 * от ответа апи. Так мы сможем легко переехать на другой апи, или быстро
 * адаптируем приложение, если апи видоизменился. Плюс ничего не разваливается с ексепшенами, если вдруг
 * апи изменился. Поменяли дтошку, поменяли сущность - приложение
 * спокойно едет дальше. Я не реализовывал это тут, т.к. ограничение по времени + это не реальный проект
 */
class AccountsService implements iAccountService {
  private _repository: Repository;

  constructor(dependencies: iDependencies) {
    this._repository = dependencies.repository;
  }

  private async _getAccounts(): Promise<Account[]> {
    return await this._repository.getAccounts();
  }

  private async _createAccount(): Promise<Account> {
    return await this._repository.createAccount();
  }

  private async _updateAccount(account: Account): Promise<Account> {
    return await this._repository.updateAccount(account);
  }

  private async _deleteAccount(id: string): Promise<string> {
    return await this._repository.deleteAccount(id);
  }

  public async getAccounts() { return await this._getAccounts() }
  public async createAccount() { return await this._createAccount(); }
  public async updateAccount(account: Account) { return await this._updateAccount(account); }
  public async deleteAccount(id: string) { return await this._deleteAccount(id); }
}

const accountService = new AccountsService({
  /**
   * Для репозитория в качестве зависимости может быть использован HTTPClient, который, в свою очередь через
   * адаптер реализует тот или иной интерфейс для http запросов. Захотели фетч - переключили адаптер, поехали
   * дальше, захотели аксиос - не проблема. Может, что-нибудь экотическое, вроде jquery ajax, для разнообразия?
   * Впрочем, все они основаны в том или ином виде на XMLHttpRequest.
   *
   * Все импорты происходят в одном файле для удобства управления зависимостями (Dependency injection).
   */
  repository: new Repository(/* HTTPClient */),
})

export default accountService; // todo singletone