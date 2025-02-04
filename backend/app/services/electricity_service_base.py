import abc


class ElectricityServiceBase(abc.ABC):
    @abc.abstractmethod
    def get_all(self, limit):
        raise NotImplementedError()

    @abc.abstractmethod
    def get_by_date(self, date):
        raise NotImplementedError()

    @abc.abstractmethod
    def get_summary_by_date(self, date):
        raise NotImplementedError

    @abc.abstractmethod
    def get_date_range(self):
        raise NotImplementedError

    @abc.abstractmethod
    def get_longest_negative_price_period(self, date):
        raise NotImplementedError
