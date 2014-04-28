class ResourceProvider
  constructor: ->

  $get: ($injector) -> $injector.invoke ['$q', '$timeout', @service.bind @]

  service: ($q, $timeout) -> (collection) =>

    ResourceCollection = (resources=[]) ->
      self = new Array
      self.__proto__ = ResourceCollection.prototype
      self.__proto__.$collection = collection
      self.$$sync resources
      self

    ResourceCollection.collection = collection

    ResourceCollection.prototype = new Array

    ResourceCollection.prototype.$stop = ->
      @$computation.stop() if @$computation?

    ResourceCollection.prototype.$$sync = (resources) ->
      ids = (r._id for r in resources)
      removed = (i for r, i in @ when r._id not in ids)
      offset = 0
      for i in removed
        @.splice i - offset, 1 
        offset += 1
      existing_ids = []
      for r in @
        existing_ids.push r._id
        r.$$sync resources[ids.indexOf r._id]
      @.push new Resource r for r in resources when r._id not in existing_ids
      @.sort (a, b) -> if ids.indexOf(a._id) > ids.indexOf(b._id) then 1 else -1

    class Resource
      @collection: collection

      constructor: (resource={}) ->
        $collection = collection
        @$$sync resource

      $update: ->
        deferred = $q.defer()
        copy = angular.copy @
        delete copy[k] for k of copy when k is '_id' or k[0] is '$'
        @collection.update @_id, {$set: copy}, (err, res) =>
          if err? then deferred.reject err else deferred.resolve @
        deferred

      $insert: ->
        deferred = $q.defer()
        @collection.insert @_id, angular.copy(@), (err, res) =>
          return deferred.reject err if err?
          @_id = res
          deferred.resolve @
        deferred

      $save: -> if @_id? then @$update() else @$insert()

      $remove: ->
        deferred = $q.defer()
        @collection.remove {_id: @_id}, (err, res) =>
          return deferred.reject err if err?
          delete @_id
          @$stop()
          deferred.resolve @
        deferred

      $stop: -> @$computation.stop() if @$computation?

      $$sync: (resource) ->
        keepers = {}
        keepers[k] = v for own k, v of @ when k[0] is '$'
        angular.copy resource, @
        @[k] = v for own k, v of keepers

      @find: (selector={}, options={}) ->
        resources = new ResourceCollection
        Deps.autorun (computation) =>
          resources.$computation = computation
          results = @collection.find(selector, options).fetch()
          $timeout ->
            resources.$$sync results
        resources

      @findOne: (selector={}, options={}) ->
        resource = new Resource
        options.limit = 1
        Deps.autorun (computation) =>
          resource.$computation = computation
          results = @collection.find(selector, options).fetch()
          $timeout ->
            resource.$$sync if results.length is 0 then {} else results[0]
        resource

    Resource

angular.module('meteorResource', []).provider 'meteorResource', ResourceProvider