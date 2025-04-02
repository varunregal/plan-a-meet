class Result
  attr_reader :success, :error, :data
  def initialize(success:, data: nil, error:)
    @success = success
    @data = data
    @error = error
  end

  def self.success(data)
    new(success: true, data: data, error: nil)
  end
  def self.failure(error)
    new(success: false, data: nil, error: error)
  end

  def success?
    @success
  end
end
